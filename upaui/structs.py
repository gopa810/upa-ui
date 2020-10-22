import io

class UIDim:
    def __init__(self, value=0, dtype=None):
        self.value = value
        self.dtype = dtype

    @staticmethod
    def percent(value):
        return UIDim(value, '%')

    @staticmethod
    def point(value):
        return UIDim(value, 'pt')

    @staticmethod
    def pixel(value):
        return UIDim(value, 'px')

    def html(self):
        return f'{self.value}{self.dtype}'

class UIColor:
    @staticmethod
    def rgb(red=0, green=0, blue=0):
        return f'rgb({red},{green},{blue})'

    @staticmethod
    def rgba(red=0, green=0, blue=0, alpha=255):
        return f'rgba({red},{green},{blue})'


for name, r, g, b in [('White', 255, 255, 255), ('Yellow', 255, 255, 0),
    ('Blue', 0, 0, 255), ('Green', 0, 255, 0), ('Red', 255, 0, 0),
    ('Cyan', 0, 255, 255), ('Magenta', 255, 0, 255), ('Gray', 127, 127, 127)]:
    setattr(UIColor, name, UIColor.rgb(r, g, b))

class UIStyle:
    PROPERTIES = ['align-content', 'align-items', 'align-self', 'animation', 'animation-delay', 
        'animation-direction', 'animation-duration', 'animation-fill-mode', 
        'animation-iteration-count', 'animation-name', 'animation-play-state', 
        'animation-timing-function', 'backface-visibility', 'background', 
        'background-attachment', 'background-clip', 'background-color', 'background-image', 
        'background-origin', 'background-position', 'background-repeat', 'background-size', 
        'border', 'border-bottom', 'border-bottom-color', 'border-bottom-left-radius', 
        'border-bottom-right-radius', 'border-bottom-style', 'border-bottom-width', 
        'border-collapse', 'border-color', 'border-image', 'border-image-outset', 
        'border-image-repeat', 'border-image-slice', 'border-image-source',
        'border-image-width', 'border-left', 'border-left-color', 'border-left-style',
        'border-left-width', 'border-radius', 'border-right', 'border-right-color',
        'border-right-style', 'border-right-width', 'border-spacing', 'border-style',
        'border-top', 'border-top-color', 'border-top-left-radius', 'border-top-right-radius',
        'border-top-style', 'border-top-width', 'border-width', 'bottom', 'box-shadow',
        'box-sizing', 'caption-side', 'clear', 'clip', 'color', 'column-count', 'column-fill',
        'column-gap', 'column-rule', 'column-rule-color', 'column-rule-style',
        'column-rule-width', 'column-span', 'column-width', 'columns', 'content',
        'counter-increment', 'counter-reset', 'cursor', 'direction', 'display', 'empty-cells',
        'flex', 'flex-basis', 'flex-direction', 'flex-flow', 'flex-grow', 'flex-shrink',
        'flex-wrap', 'float', 'font', 'font-family', 'font-size', 'font-size-adjust',
        'font-stretch', 'font-style', 'font-variant', 'font-weight', 'height',
        'justify-content', 'left', 'letter-spacing', 'line-height', 'list-style',
        'list-style-image', 'list-style-position', 'list-style-type', 'margin', 'margin-bottom',
        'margin-left', 'margin-right', 'margin-top', 'max-height', 'max-width', 'min-height',
        'min-width', 'opacity', 'order', 'outline', 'outline-color',
        'outline-offset', 'outline-style', 'outline-width', 'overflow',
        'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left',
        'padding-right', 'padding-top', 'page-break-after', 'page-break-before',
        'page-break-inside', 'perspective', 'perspective-origin', 'position',
        'quotes', 'resize', 'right', 'tab-size', 'table-layout', 'text-align',
        'text-align-last', 'text-decoration', 'text-decoration-color',
        'text-decoration-line', 'text-decoration-style', 'text-indent',
        'text-justify', 'text-overflow', 'text-shadow', 'text-transform', 'top',
        'transform', 'transform-origin', 'transform-style', 'transition',
        'transition-delay', 'transition-duration', 'transition-property',
        'transition-timing-function', 'vertical-align', 'visibility', 'white-space', 'width',
        'word-break', 'word-spacing', 'word-wrap', 'z-index']

    def __init__(self, values=None):
        if values is not None:
            self.set(values)

    def html(self):
        stream = io.StringIO()
        for attr_name,attr_value in self.__dict__.items():
            name = attr_name.replace('_', '-')
            stream.write(name)
            stream.write(':')
            if isinstance(attr_value, str):
                if ' ' in attr_value:
                    stream.write(f'"{attr_value}"')
                else:
                    stream.write(attr_value)
            elif isinstance(attr_value, tuple):
                stream.write(' '.join(attr_value))
            else:
                stream.write(str(attr_value))
            stream.write(';')
        return stream.getvalue()

    def set(self, values):
        if isinstance(values,dict):
            for k,v in values.items():
                setattr(self, k.replace('-','_'), v)

    def json(self):
        return dict(self.__dict__)


class UISide:
    No = 0
    Left = 1
    Top = 2
    Right = 4
    Bottom = 8
    Vertical = 5
    Horizontal = 10
    All = 15


