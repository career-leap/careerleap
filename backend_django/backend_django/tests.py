import ipaddress

from django.test import RequestFactory, TestCase, override_settings

from .middleware import XForwardedForMiddleware


DEFAULT_TRUSTED_PROXIES = [
    ipaddress.ip_network('10.0.0.0/8'),
    ipaddress.ip_network('172.16.0.0/12'),
    ipaddress.ip_network('192.168.0.0/16'),
    ipaddress.ip_network('127.0.0.0/8'),
]


class XForwardedForMiddlewareTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.middleware = XForwardedForMiddleware(lambda req: None)

    @override_settings(TRUSTED_PROXY_IPS=DEFAULT_TRUSTED_PROXIES)
    def test_sets_client_ip_from_trusted_proxy(self):
        request = self.factory.get(
            '/', HTTP_X_FORWARDED_FOR='1.2.3.4', REMOTE_ADDR='10.0.0.1'
        )
        self.middleware(request)
        self.assertEqual(request.META['REMOTE_ADDR'], '1.2.3.4')

    @override_settings(TRUSTED_PROXY_IPS=DEFAULT_TRUSTED_PROXIES)
    def test_ignores_spoofed_x_forwarded_for_from_public_ip(self):
        request = self.factory.get(
            '/', HTTP_X_FORWARDED_FOR='1.2.3.4', REMOTE_ADDR='5.6.7.8'
        )
        self.middleware(request)
        self.assertEqual(request.META['REMOTE_ADDR'], '5.6.7.8')

    @override_settings(TRUSTED_PROXY_IPS=DEFAULT_TRUSTED_PROXIES)
    def test_strips_multiple_trusted_proxies(self):
        request = self.factory.get(
            '/',
            HTTP_X_FORWARDED_FOR='1.2.3.4, 10.0.0.5',
            REMOTE_ADDR='172.16.0.10',
        )
        self.middleware(request)
        self.assertEqual(request.META['REMOTE_ADDR'], '1.2.3.4')

    @override_settings(TRUSTED_PROXY_IPS=DEFAULT_TRUSTED_PROXIES)
    def test_leaves_remote_addr_when_no_header(self):
        request = self.factory.get('/', REMOTE_ADDR='1.2.3.4')
        self.middleware(request)
        self.assertEqual(request.META['REMOTE_ADDR'], '1.2.3.4')

    @override_settings(TRUSTED_PROXY_IPS=DEFAULT_TRUSTED_PROXIES)
    def test_handles_invalid_remote_addr_gracefully(self):
        request = self.factory.get(
            '/', HTTP_X_FORWARDED_FOR='1.2.3.4', REMOTE_ADDR='invalid'
        )
        self.middleware(request)
        self.assertEqual(request.META['REMOTE_ADDR'], 'invalid')
