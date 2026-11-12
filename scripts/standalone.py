from pathlib import Path
import re,base64
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
css=(root/'src/style.css').read_text()
config=(root/'src/config.js').read_text().replace('export const event','const event')
js=(root/'src/main.js').read_text().replace("import { event } from './config.js';",'').replace("import('gsap')","Promise.resolve({gsap:window.gsap})")
vendor=(root/'node_modules/gsap/dist/gsap.min.js').read_text()
html=re.sub(r'<link\s+rel="stylesheet"\s+href="/src/style\.css"\s*/?>','<style>'+css+'</style>',html)
html=re.sub(r'<script\s+type="module"\s+src="/src/main\.js"\s*>\s*</script>',lambda _: '<script>'+vendor.replace('</script','<\\/script')+'</script><script>'+config+'\n'+js+'</script>',html)
asset='data:image/webp;base64,'+base64.b64encode((root/'public/assets/thao-graduation.webp').read_bytes()).decode()
html=html.replace('/assets/thao-graduation.webp',asset)
(root/'Thu_Moi_Thanh_Thao.html').write_text(html)
print('Created standalone HTML')
