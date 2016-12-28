def replacer00(matches):
    fn=matches.group(1)
    fn='to'+fn[0].upper()+fn[1:]+'()'
    return fn
with open('../src/color-utils.js','r+',encoding='utf-8')as f:
    content=f.read()
    import re
    content=re.sub(r'(rgb|hex|hsl|hsv|cmyk|xyz|lab|lch|ryb)\s*\(\)',replacer00,content)
    content=content.replace('\t', ' ')
    f.truncate(0)
    f.seek(0)
    f.write(content)
