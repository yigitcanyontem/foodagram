import os
import time
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = 'Delete uploaded images older than 30 minutes'

    def handle(self, *args, **kwargs):
        uploads_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')

        if not os.path.exists(uploads_dir):
            self.stdout.write(self.style.WARNING('Uploads folder does not exist.'))
            return

        now = time.time()
        deleted = 0
        max_age_seconds = 30 * 60  # 30 minutes

        for filename in os.listdir(uploads_dir):
            file_path = os.path.join(uploads_dir, filename)
            if os.path.isfile(file_path):
                file_age = now - os.path.getmtime(file_path)
                if file_age > max_age_seconds:
                    os.remove(file_path)
                    deleted += 1

        self.stdout.write(self.style.SUCCESS(f'Deleted {deleted} old uploaded images.'))