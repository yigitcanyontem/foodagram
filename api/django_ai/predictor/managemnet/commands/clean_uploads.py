import os
import time
from django.core.management.base import BaseCommand
from django.conf import settings
from pathlib import Path


class Command(BaseCommand):
    help = 'Delete uploaded images and temporary videos older than 30 minutes'


    def handle(self, *args, **kwargs):
        uploads_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
        temp_videos_dir = Path('temp_videos')
        now = time.time()
        max_age_seconds = 30 * 60  # 30 minutes
        deleted_files = 0

        def delete_old_files(directory):
            nonlocal deleted_files
            if not os.path.exists(directory):
                self.stdout.write(self.style.WARNING(f'{directory} does not exist.'))
                return
            for filename in os.listdir(directory):
                file_path = os.path.join(directory, filename)
                if os.path.isfile(file_path):
                    file_age = now - os.path.getmtime(file_path)
                    if file_age > max_age_seconds:
                        try:
                            os.remove(file_path)
                            deleted_files += 1
                        except Exception as e:
                            self.stdout.write(self.style.ERROR(f"Failed to delete {file_path}: {e}"))

        delete_old_files(uploads_dir)
        delete_old_files(temp_videos_dir)

        self.stdout.write(self.style.SUCCESS(f'Deleted {deleted_files} old uploaded files and videos.'))
