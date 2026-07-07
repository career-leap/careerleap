"""File upload utilities, including optional virus scanning."""
import logging

from django.conf import settings

logger = logging.getLogger(__name__)


def scan_upload_for_viruses(file_obj):
    """
    Scan an uploaded file for viruses using a ClamAV daemon.

    Returns a dict:
        {'safe': bool, 'message': str}

    If no ClamAV host is configured, the file is allowed and a warning is logged.
    This keeps uploads working in local/dev environments without a scanner while
    making it easy to enable scanning in production by setting CLAMAV_HOST.
    """
    clamav_host = getattr(settings, 'CLAMAV_HOST', None)
    if not clamav_host:
        logger.warning(
            "Virus scanning skipped: CLAMAV_HOST is not configured. "
            "Set CLAMAV_HOST (and optionally CLAMAV_PORT) to enable ClamAV scanning."
        )
        return {'safe': True, 'message': 'Scanner not configured'}

    try:
        import clamd
    except ImportError:
        logger.error("clamd package is not installed but CLAMAV_HOST is set.")
        return {
            'safe': False,
            'message': 'Virus scanner is misconfigured (clamd missing)',
        }

    try:
        cd = clamd.ClamdNetworkSocket(
            host=clamav_host,
            port=getattr(settings, 'CLAMAV_PORT', 3310),
            timeout=getattr(settings, 'CLAMAV_TIMEOUT', 30),
        )

        # Reset file pointer and scan via stream
        file_obj.seek(0)
        result = cd.scan_stream(file_obj.read())
        file_obj.seek(0)

        if result is None:
            return {'safe': True, 'message': 'Clean'}

        # clamd returns {stream: ('FOUND', 'VirusName')} or {stream: ('ERROR', 'reason')}
        stream_result = result.get('stream')
        if stream_result:
            status, details = stream_result
            if status == 'FOUND':
                logger.warning(f"Virus detected in upload: {details}")
                return {
                    'safe': False,
                    'message': f'Virus detected: {details}',
                }
            if status == 'ERROR':
                logger.error(f"ClamAV scan error: {details}")
                return {
                    'safe': False,
                    'message': f'Scanner error: {details}',
                }

        return {'safe': True, 'message': 'Clean'}

    except Exception as e:
        logger.exception(f"ClamAV scan failed: {e}")
        return {
            'safe': False,
            'message': f'Unable to scan file: {str(e)}',
        }
