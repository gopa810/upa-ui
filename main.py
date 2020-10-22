import upaui as ui
import json



app = ui.Application()

app.loadUI('pages.json')
wnd = app.getWindow()

wnd.compile()

print('=================')
print(json.dumps(wnd.json(), indent=4))
print('=================')
#app.start()
