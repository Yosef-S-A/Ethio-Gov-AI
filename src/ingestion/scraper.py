import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import time

# Mimic a local Ethiopian user agent
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive"
}

TARGET_URL = "https://mesfinbelachew.net/proc.php"
RAW_DATA_PATH = "data/raw/"

def download_proclamations(limit=10):
    print(f"--- Accessing: {TARGET_URL} ---")
    os.makedirs(RAW_DATA_PATH, exist_ok=True)
    
    try:
        response = requests.get(TARGET_URL, headers=HEADERS, timeout=20)
        if response.status_code != 200:
            print(f"Failed to load page. Status: {response.status_code}")
            return

        soup = BeautifulSoup(response.text, 'html.parser')
        
        print(">>>>>>>>>>", soup)
        
        # In proc.php, laws are usually in a <table>. 
        # We look for links that likely point to PDFs.
        links = soup.find_all('a', href=True)
        print(f"Total potential links found: {len(links)}")
        
        count = 0
        for link in links:
            href = link['href']
            
            # Pattern check: Does it look like a proclamation file?
            if ".pdf" in href.lower() or "download" in href.lower():
                pdf_url = urljoin(TARGET_URL, href)
                
                # Create a clean filename from the URL or link text
                clean_name = href.split('/')[-1]
                if not clean_name.lower().endswith('.pdf'):
                    clean_name += ".pdf"
                
                print(f"Attempting: {clean_name}")
                
                # Be polite to avoid blocking
                time.sleep(2)
                
                file_res = requests.get(pdf_url, headers=HEADERS, stream=True)
                if file_res.status_code == 200:
                    with open(os.path.join(RAW_DATA_PATH, clean_name), 'wb') as f:
                        for chunk in file_res.iter_content(chunk_size=1024*1024):
                            f.write(chunk)
                    print(f"✅ SAVED: {clean_name}")
                    count += 1
                else:
                    print(f"❌ SKIP: {file_res.status_code}")

            if count >= limit:
                break
                
        print(f"\n--- Phase 1 Complete: {count} files in {RAW_DATA_PATH} ---")

    except Exception as e:
        print(f"Diagnostic Error: {e}")

if __name__ == "__main__":
    download_proclamations(limit=5)