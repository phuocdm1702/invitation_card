from pathlib import Path
import re,base64
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
css=(root/'src/style.css').read_text()
config=(root/'src/config.js').read_text().replace('export const event','const event')
js=(root/'src/main.js').read_text().replace("import { event } from './config.js';",'').replace("import('gsap')","Promise.resolve({gsap:window.gsap})")
vendor=(root/'node_modules/gsap/dist/gsap.min.js').read_text()
html=html.replace('<link rel="stylesheet" href="/src/style.css">','<style>'+css+'</style>')
html=html.replace('<script type="module" src="/src/main.js"></script>','<script>'+vendor.replace('</script','<\\/script')+'</script><script>'+config+'\n'+js+'</script>')
asset='data:image/webp;base64,'+base64.b64encode((root/'public/assets/thao-graduation.webp').read_bytes()).decode()
html=html.replace('/assets/thao-graduation.webp',asset)
(root/'Thu_Moi_Thanh_Thao.html').write_text(html)
print('Created standalone HTML')
