"""Management command to prune old metrics events."""
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from metrics.models import Event


class Command(BaseCommand):
    help = "Delete metrics events older than the specified retention period."

    def add_arguments(self, parser):
        parser.add_argument(
            '--days',
            type=int,
            default=90,
            help='Retention period in days (default: 90).',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show how many events would be deleted without deleting them.',
        )

    def handle(self, *args, **options):
        days = options['days']
        dry_run = options['dry_run']
        cutoff = timezone.now() - timedelta(days=days)

        old_events = Event.objects.filter(created_at__lt=cutoff)
        count = old_events.count()

        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    f"Dry run: {count} event(s) older than {days} days would be deleted."
                )
            )
            return

        if count == 0:
            self.stdout.write(
                self.style.SUCCESS(f"No events older than {days} days found.")
            )
            return

        deleted, _ = old_events.delete()
        self.stdout.write(
            self.style.SUCCESS(
                f"Deleted {deleted} event(s) older than {days} days."
            )
        )
