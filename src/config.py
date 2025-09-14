import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'asdf#FGSgvasgf$5$WGT'
    SUPABASE_URL = os.environ.get('SUPABASE_URL') or 'https://yhiikdnvoxmnpwejphnz.supabase.co'
    SUPABASE_KEY = os.environ.get('SUPABASE_KEY') or 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaWlrZG52b3htbnB3ZWpwaG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4ODkwMDAsImV4cCI6MjA3MzQ2NTAwMH0.opXjQl51q5IuiEEN-1E8iH4diM0vOBkHya7zizTuW6U'
    SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_KEY') or 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloaWlrZG52b3htbnB3ZWpwaG56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzg4OTAwMCwiZXhwIjoyMDczNDY1MDAwfQ.iViJrDribM6_lXhWxDA_7vJML1Hd8VOIFh0NWf5DtNY'

