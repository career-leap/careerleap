"""
Custom security middleware.
"""

import ipaddress

from django.conf import settings


class XForwardedForMiddleware:
    """
    Rewrite REMOTE_ADDR from X-Forwarded-For when the immediate peer is a
    trusted proxy. This makes rate limiting, logging, and security decisions
    use the real client IP instead of the load balancer / reverse proxy IP.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        self._set_remote_addr(request)
        return self.get_response(request)

    @staticmethod
    def _is_trusted_proxy(ip_addr):
        networks = getattr(settings, 'TRUSTED_PROXY_IPS', [])
        try:
            parsed = ipaddress.ip_address(ip_addr)
        except ValueError:
            return False
        return any(parsed in network for network in networks)

    def _set_remote_addr(self, request):
        remote_addr = request.META.get('REMOTE_ADDR')
        if not remote_addr:
            return

        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR', '')
        if not x_forwarded_for:
            return

        # Build the proxy chain: left = original client, right = peer closest to us.
        # Append REMOTE_ADDR because it is the immediate peer/proxy we are connected to.
        ips = [ip.strip() for ip in x_forwarded_for.split(',') if ip.strip()]
        ips.append(remote_addr)

        # Remove trusted proxies from the right. The rightmost remaining IP is the
        # first untrusted hop and therefore the real client address.
        while ips:
            candidate = ips[-1]
            if self._is_trusted_proxy(candidate):
                ips.pop()
            else:
                break

        if ips:
            request.META['REMOTE_ADDR'] = ips[-1]


class SecurityHeadersMiddleware:
    """
    Middleware to add security headers to all responses.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # Content Security Policy
        # Restricts sources of content to prevent XSS attacks
        response['Content-Security-Policy'] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: blob:; "
            "font-src 'self'; "
            "connect-src 'self'; "
            "media-src 'self'; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self';"
        )
        
        # Prevent MIME type sniffing
        response['X-Content-Type-Options'] = 'nosniff'
        
        # XSS Protection
        response['X-XSS-Protection'] = '1; mode=block'
        
        # Referrer Policy
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Permissions Policy (formerly Feature Policy)
        response['Permissions-Policy'] = (
            'geolocation=(), '
            'microphone=(), '
            'camera=(), '
            'payment=(), '
            'usb=(), '
            'magnetometer=(), '
            'gyroscope=(), '
            'speaker=()'
        )
        
        # Remove server information
        response['Server'] = 'CareerLeap'
        
        return response
