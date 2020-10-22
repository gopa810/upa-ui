import uuid
import io
from .structs import UIDim, UIColor, UIStyle, UISide

class UIView:
    def __init__(self, styles=None):
        self.style = UIStyle(styles)
        self.tag = str(uuid.uuid4())
        self.children = []
        self.parent = None

    def html(self, stream):
        text = stream
        text.write("<div")
        text.write(f" tag='{self.tag}'")
        text.write(" style='{}'".format(self.style.html()))
        print(">", file=stream)

        self.renderContent(text)
        print(file=stream)
        print('<!-- children -->', file=stream)
        for c in self.children:
            c.html(text)

        print('</div>', file=text)

    def json(self):
        return {
            'object': 'View',
            'style': self.style.json(),
            'children': [a.json() for a in self.children]
        }
    def renderContent(self, stream):
        pass

    def addView(self, view):
        self.children.append(view)
        if view.parent is not None:
            view.parent.removeView(view)
        view.parent = self

    def removeView(self, view):
        self.children.remove(view)

    def dock(self, side):
        if side & UISide.Top > 0:
            self.style.top = '0'
            if side & UISide.Bottom > 0:
                self.style.height = '100%'
        elif side & UISide.Bottom > 0:
            self.style.position = 'absolute'
            self.style.bottom = '1px'

        if side & UISide.Left > 0:
            self.style.left = '0'
            if side & UISide.Right > 0:
                self.style.width = '100%'
        elif side & UISide.Right > 0:
            self.style.right = '1px'
            self.style.position = 'absolute'


class UILabel(UIView):
    def __init__(self, styles=None, text=''):
        UIView.__init__(self, styles)
        self.text = text

    def renderContent(self, stream):
        stream.write(self.text.replace('<', '&lt;').replace('>', '&gt;').replace('&', '&amp;'))

class UIFlexItem(UIView):
    def __init__(self, styles=None, view=None):
        UIView.__init__(self, styles)
        if view is not None:
            self.addView(view)

class UIFlexGrid(UIView):
    def __init__(self, direction, styles=None, items=None):
        UIView.__init__(self, styles)
        self.style.display = 'flex'
        self.style.flex_direction = direction
        if items is not None:
            for v in items:
                self.addItem(v)

    def addItem(self, view):
        flexItem = UIFlexItem(view=view)
        self.addView(flexItem)
        return flexItem

class UIHorizontalGrid(UIFlexGrid):
    def __init__(self, styles=None, items=None):
        UIFlexGrid.__init__(self, 'row', styles, items)

class UIVerticalGrid(UIFlexGrid):
    def __init__(self, styles=None, items=None):
        UIFlexGrid.__init__(self, 'column', styles, items)

        