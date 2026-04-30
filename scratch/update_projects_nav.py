import os
import re

def update_nav(content):
    # Desktop About Dropdown
    # This regex is a bit broad to catch variations in whitespace/formatting
    desktop_pattern = re.compile(r'<li class="nav__item nav__item--dropdown">\s*<button[^>]*>\s*About.*?</li>', re.DOTALL)
    new_desktop = '          <li class="nav__item">\n            <a href="../about.html" class="nav__link">About</a>\n          </li>'
    
    # Mobile About Accordion
    mobile_pattern = re.compile(r'<li class="nav__mobile-item--accordion">\s*<button[^>]*>\s*About.*?</li>', re.DOTALL)
    new_mobile = '      <li><a href="../about.html" class="nav__mobile-link">About</a></li>'

    content = desktop_pattern.sub(new_desktop, content, 1) # Only first occurrence (header)
    content = mobile_pattern.sub(new_mobile, content, 1)   # Only first occurrence (mobile menu)
    
    return content

projects_dir = r'c:\Users\ujjwa\OneDrive\Desktop\flt\floatex\projects'
for filename in os.listdir(projects_dir):
    if filename.endswith('.html'):
        filepath = os.path.join(projects_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = update_nav(content)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
        else:
            print(f"No changes for {filename}")
