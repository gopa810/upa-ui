import io

from .view import UIView
from .structs import UIDim, UIColor, UIStyle, UISide

class UIValue:
    def __init__(self, name=None, value=None, vtype=0, index=-1):
        self.name = name
        # value of coordinate
        self.value = value
        # type of value (0-default not initialized, 1-calculated, 2-explicit)
        self.vtype = vtype
        # index of this value in global list of coordinates
        self.index = index
        # references count
        self.refs = 0
    def json(self):
        return f'[{self.name}, {self.value}, {self.vtype}, {self.index}, {self.refs}]'

class UIDiv:
    MAPNAMES = ['left', 'top', 'right', 'bottom', 'cx', 'cy', 'width', 'height']
    def __init__(self, name=''):
        self.name = name
        self.coords = [UIValue(name) for i in range(8)]
        self.style = {}
        self.subviews = {}
        self.parent = None
    def setCoord(self, key, value):
        i = UIDiv.MAPNAMES.index(key)
        if i>=0:
            self.coords[i].value = value
            self.coords[i].vtype = 2
    def getCoordIndex(self, coord):
        i = UIDiv.MAPNAMES.index(coord)
        if i < 0:
            return -1
        return self.coords[i].index
    def setIndexes(self, startidx):
        for c in self.coords:
            c.index = startidx
            startidx += 1
    def json(self):
        return {
            'name': self.name,
            'coords': [a.json() for a in self.coords],
            'style': self.style
        }
    def resolveAllCoordinates(self):
        def vtp(a):
            return self.coords[a].vtype
        def vtp2(a,b):
            return vtp(a)!=0 and vtp(b)!=0
        def itp(a):
            return ['ref', self.coords[a].index]
        def stp(a,b,ox):
            if vtp(a[0]+ox)==0 and vtp2(a[1]+ox, a[2]+ox):
                self.coords[a[0]+ox].value = b
                self.coords[a[0]+ox].vtype = 1
        def stp2(a,b):
            self.coords[a].value = b
            self.coords[a].vtype = 1
        def genarr():
            arr = ['cont']
            for i in [0,1,2,3]:
                if vtp(i) != 0:
                    arr.append(self.coords[i].index)
            return arr

        for oxp in [0, 1, 2, 3, 4]:
            if oxp in [0,1,3,4]:
                if oxp >= 3:
                    ox = oxp - 3
                else:
                    ox = oxp
                stp([0,2,6], ['-', itp(2+ox), itp(6+ox)], ox)
                stp([0,2,4], ['-', ['*2', itp(4+ox)], itp(2+ox)], ox)
                stp([0,4,6], ['-', itp(4+ox), ['/2', itp(6+ox)]], ox)

                stp([2,0,6], ['+', itp(0+ox), itp(6+ox)], ox)
                stp([2,0,4], ['-', ['*2', itp(4+ox)], itp(0+ox)], ox)
                stp([2,4,6], ['+', itp(4+ox), ['/2', itp(6+ox)]], ox)

                stp([4,0,2], ['/2', ['+', itp(0+ox), itp(2+ox)]], ox)
                stp([4,0,6], ['+', itp(0+ox), ['/2', itp(6+ox)]], ox)
                stp([4,2,6], ['-', itp(2+ox), ['/2', itp(6+ox)]], ox)

                stp([6,0,2], ['-', itp(2+ox), itp(0+ox)], ox)
                stp([6,2,4], ['*2', ['-', itp(2+ox), itp(4+ox)]], ox)
                stp([6,0,4], ['*2', ['-', itp(4+ox), itp(0+ox)]], ox)
            if oxp == 2:
                if vtp(0) == 0 and vtp(2) != 0:
                    stp2(0, genarr())
                if vtp(2) == 0 and vtp(0) != 0:
                    stp2(2, genarr())
                if vtp(1) == 0 and vtp(3) != 0:
                    stp2(1, genarr())
                if vtp(3) == 0 and vtp(1) != 0:
                    stp2(3, genarr())


class UIWindow:
    def __init__(self, data={}, name='main'):
        if '/' in name:
            raise Exception('Slash in view name:' + name)
        self.name = name
        self.data = data
        self.resetDivs()

    def resetDivs(self):
        # initial values representing screen 
        self.coords = []
        self.divs = []
        scene = UIDiv('scene')
        for i in range(4):
            scene.coords[i].value = 0
            scene.coords[i].vtype = 2
        self.sceneAddDiv(scene)

    def json(self):
        eval_order = []
        divs = []
        for a in self.coords:
            if a.name not in eval_order:
                eval_order.append(a.name)

        for a in eval_order:
            for b in self.divs:
                if b.name == a:
                    divs.append(b.json())

        return {
            'name': self.name,
            #'coords': [a.json() for a in self.coords],
            #'evalorder': eval_order,
            'views': divs
        }

    def compile(self, viewName=None, viewData=None):
        need_resolve = False
        if viewName is None:
            viewName = self.name
        if viewData is None:
            need_resolve = True
            if viewName not in self.data:
                raise Exception('Undefined window ' + viewName)
            viewData = self.data[viewName]
        # indexes to self.coords
        div = UIDiv(viewName)
        for key, value in viewData.items():
            if key in UIDiv.MAPNAMES:
                div.setCoord(key, value)
            elif key in UIStyle.PROPERTIES:
                div.style[key] = value

        # add this view as part of scene
        self.sceneAddDiv(div)

        if 'subviews' in viewData and isinstance(viewData['subviews'],dict):
            for subName, subData in viewData['subviews'].items():
                if '/' in subName:
                    raise Exception('Slash in viewName: ' + subName)
                if isinstance(subData,dict):
                    subd = self.compile(viewName + '/' + subName, subData)
                    div.subviews[subName] = subd
                    subd.parent = div
                elif isinstance(subData,str):
                    vd = self.getViewFromHierarchy(subData)
                    if vd is not None:
                        subd = self.compile(viewName + '/' + subName, vd)
                        div.subviews[subName] = subd
                        subd.parent = div

            for sname,subview  in div.subviews.items():
                self.resolveCoordinates(subview)

        if need_resolve:
            div.parent = self.divs[0]
            self.divs[0].subviews[viewName] = div
            self.resolveCoordinates(div)
            self.countReferences()
            self.coords.sort(key=lambda crd: crd.refs, reverse=True)

        return div

    def resolveCoordinates(self, div):
        for c in div.coords:
            c.value = self.resolveCoord(div, c.value)

    def countReferences(self):
        for a in range(len(self.coords)):
            if isinstance(self.coords[a].value,list):
                self.traceReferences(self.coords[a].value)

    def traceReferences(self, value):
        if value[0] == 'ref' or value[0] == 'cont':
            for vidx in range(1,len(value)):
                cr = self.coords[value[vidx]]
                cr.refs += 1
                if isinstance(cr.value,list):
                    self.traceReferences(cr.value)
            return
        for subc in value:
            if isinstance(subc, list):
                self.traceReferences(subc)

    def render(self, windowname=None):
        if windowname is None:
            windowname = self.name
        text = io.StringIO()
        print('<html>', file=text)
        print('<head>', file=text)
        #
        # javascript for page:
        #   - onLoading:
        #     open WebSocket channel
        #     set screen dimensions and calculate other variables in screen
        #     update dimensions for all views
        #     update content for all views
        #
        print('</head>', file=text)
        print("<body style='background:yellow;margin:0px;padding:0px;'>", file=text)
        self.resetDivs()
        self.compile(windowname)
        self.html(text)
        print('</body>', file=text)
        print('</html>', file=text)
        return text.getvalue()

    def sceneAddDiv(self, div):
        self.divs.append(div)
        div.setIndexes(len(self.coords))
        self.coords.extend(div.coords)
        div.resolveAllCoordinates()

    def html(self, viewName, viewData, stream):
        self.view.html(stream)

    def resolveCoord(self, div, value):
        if isinstance(value,int):
            return value
        elif isinstance(value,str):
            if value.startswith('$'):
                parts = value[1:].split('/')
                crd = parts[-1]
                parts = parts[:-1]
                curr = div
                for p in parts:
                    if p == '':
                        curr = self.divs[0]
                    elif p == '..':
                        curr = curr.parent
                    elif p == '.':
                        curr = div
                    elif p in curr.subviews:
                        curr = curr.subviews[p]
                    else:
                        raise Exception(f'View {curr.name} does not have subview named {p}')
                idx = curr.getCoordIndex(crd)
                if idx < 0:
                    raise Exception(f'Unknown coordinate {crd} for view {curr.name}')
                return ['ref', idx]
            elif value in UIDiv.MAPNAMES:
                return ['ref', div.getCoordIndex(value)]
            else:
                return value
        elif isinstance(value,list):
            try:
                return [self.resolveCoord(div, a) for a in value]
            except:
                raise
        else:
            raise Exception('Resolve coord: ', value)

    def getViewFromHierarchy(self, name):
        '''
        Input is name of view. Name is respecting hierarchical notation of name,
        that means name1.name2.name3....nameN, where dots are separating 
        individual names of views, and where name2 is subview of name1, name3 
        is subview of name2, etc.

        'subviews' key in view definition is dictionary, where key is
        name of subview and value is its definition
        definition is either dictionary, or string reference
        
        (string reference == hierarchical name of view)
        '''
        ps = name.split('.')
        idx = 0
        if p[0] in self.data:
            viewData = self.data[p[0]]
            for i in range(1,len(ps)):
                if isinstance(viewData,str):
                    vd = getViewFromHierarchy(viewData)
                    if vd is None:
                        raise Exception(f'{viewData} not found in window datas')
                    viewData = vd
                if 'subviews' in viewData and isinstance(viewData['subviews']) \
                    and ps[i] in viewData['subviews']:
                    viewData = viewData['subviews'][ps[i]]
            return viewData
        else:
            return None

    def addView(self, view):
        self.view.addView(view)

    def removeView(self, view):
        if view is self.view:
            self.view = None

