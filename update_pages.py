import collections
import os
import re

pages = [
    'index.htm',
    'color_picker.htm',
    'color_names.htm',
]

links = collections.OrderedDict()

with open('templates/heading.txt', encoding='u8') as f:
    heading = f.read()

with open('templates/links.txt', encoding='u8') as f:
    lines = f.readlines()
    for line in lines:
        line = line.strip()
        if not line:
            print('Empty line detected')
            continue
        link, title = line.split('|')
        links[link.rstrip()] = title.lstrip()

with open('templates/footer.txt', encoding='u8') as f:
    footer = f.read()

for page in pages:
    if not os.path.isfile(page):
        continue
    with open(page, 'r+', encoding='u8') as f:
        original_content = content = f.read()
        content = re.sub(
            r'(?i)<h1>[\s\S]*?</h1>',
            '<h1>{}</h1>'.format(heading),
            content)
        page_title = ''
        page_links = '<ul>'
        for link, title in links.items():
            if link == page:
                page_title = title
                page_links += '<li>{}</li>'.format(title)
            else:
                if link.startswith('http'):
                    link += '" target="_blank'
                page_links += '<li><a href="{}">{}</a></li>'.format(
                    link, title)
        page_links += '</ul>'
        content = re.sub(
            r'(?<=<title>)[\s\S]*?(?=</title>)',
            '{} &#124; {}'.format(page_title, heading),
            content)
        content = re.sub(
            r'(?<=<h2>)[\s\S]*?(?=</h2>)',
            page_title,
            content)
        content = re.sub(
            r'(?<=<nav class="nav">)[\s\S]*?(?=</nav>)',
            page_links,
            content)
        content = re.sub(
            r'(?<=<footer class="footer">)[\s\S]*?(?=</footer>)',
            footer,
            content)
        if content is not original_content:
            f.truncate(0)
            f.seek(0)
            f.write(content)
