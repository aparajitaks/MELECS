#!/usr/bin/env python3
"""
Add Techasoft-style GSAP scroll animations to all MELECS HTML pages.
"""

import os
import re

WORKSPACE = '/Users/veritan/Work/melecs'

HTML_FILES = [
    'index.html',
    'about.html',
    'services.html',
    'contact.html',
    'careers.html',
    'electrical-design.html',
    'manufacturing.html',
    'mechanical-design.html',
    'oil-and-gas.html',
    'software.html',
]

CDN_SCRIPTS = '''  <!-- GSAP + ScrollTrigger + Lenis -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>'''

SCROLL_EFFECTS_SCRIPT = '  <script src="assets/js/scroll-effects.js"></script>'

# Classes to add 'reveal' to
REVEAL_CLASSES = [
    'sec-head',
    'sec-lines',
    'industry-card',
    'milestone-card',
    'timeline-step',
    'why-card',
    'touch-glass-form-card',
    'bento-card',
]

def add_scripts(content, filename):
    """Insert CDN scripts before main.js and scroll-effects.js after main.js."""
    # Check if already added
    if 'gsap@3.12.5' in content:
        print(f'  [SKIP] Scripts already present in {filename}')
        return content

    # Find the main.js script tag line
    main_js_pattern = r'([ \t]*<script src="assets/js/main\.js"></script>)'
    match = re.search(main_js_pattern, content)
    if not match:
        print(f'  [WARN] Could not find main.js script tag in {filename}')
        return content

    main_js_line = match.group(1)
    replacement = CDN_SCRIPTS + '\n' + main_js_line + '\n' + SCROLL_EFFECTS_SCRIPT
    content = content.replace(main_js_line, replacement, 1)
    print(f'  [OK] Added CDN scripts to {filename}')
    return content


def add_reveal_to_class(content, cls, filename):
    """Add 'reveal' class to elements that have the given class but not 'reveal' yet."""
    # Pattern: class="... cls ..." (cls can be surrounded by spaces, quotes, or other classes)
    # We need to handle cases where cls appears in the class attribute
    
    def replacer(m):
        full_match = m.group(0)
        class_attr = m.group(1)
        # Check if 'reveal' is already there
        classes = class_attr.split()
        if 'reveal' in classes:
            return full_match
        # Add reveal
        new_class_attr = class_attr + ' reveal'
        return full_match.replace(f'class="{class_attr}"', f'class="{new_class_attr}"', 1)
    
    # Match class attributes containing the target class
    # This regex captures the full class attribute value
    pattern = r'class="([^"]*\b' + re.escape(cls) + r'\b[^"]*)"'
    
    new_content, count = re.subn(pattern, replacer, content)
    if count > 0:
        print(f'  [OK] Added reveal to {count} .{cls} elements in {filename}')
    return new_content


def add_reveal_to_intro_strip(content, filename):
    """Add reveal to intro-strip section."""
    pattern = r'(<section class="intro-strip)(")'
    if 'reveal' in content[content.find('intro-strip'):content.find('intro-strip')+50] if 'intro-strip' in content else '':
        return content
    new_content = re.sub(pattern, r'\1 reveal\2', content)
    if new_content != content:
        print(f'  [OK] Added reveal to .intro-strip in {filename}')
    return new_content


def update_counter_classes(content, filename):
    """Change counter-val to count class (keep counter-val too) for the count-up animation."""
    # The existing HTML has class="counter-val" with data-target already
    # We need class="count" with data-target for our JS
    # Strategy: add 'count' class to elements that have 'counter-val' and 'data-target'
    
    pattern = r'(<span class=")(counter-val)(" data-target=)'
    new_content = re.sub(pattern, r'\1count counter-val\3', content)
    if new_content != content:
        count = len(re.findall(pattern, content))
        print(f'  [OK] Added "count" class to counter-val spans in {filename}')
    return new_content


def process_file(filename):
    filepath = os.path.join(WORKSPACE, filename)
    if not os.path.exists(filepath):
        print(f'  [MISS] {filename} not found, skipping.')
        return

    print(f'\nProcessing: {filename}')
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Add CDN scripts
    content = add_scripts(content, filename)

    # 2. Add reveal classes to target elements
    for cls in REVEAL_CLASSES:
        content = add_reveal_to_class(content, cls, filename)

    # 3. Add reveal to intro-strip section (index.html specific)
    if filename == 'index.html':
        content = add_reveal_to_intro_strip(content, filename)
        # 4. Update counter classes
        content = update_counter_classes(content, filename)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'  [SAVED] {filename}')
    else:
        print(f'  [NO CHANGE] {filename}')


def main():
    print('=== MELECS Scroll Animations Installer ===\n')
    for filename in HTML_FILES:
        process_file(filename)
    print('\n=== Done! ===')


if __name__ == '__main__':
    main()
