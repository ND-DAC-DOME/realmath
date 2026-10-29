import { Footer } from "./Footer"
import { Header } from "./Header"
import { About } from "./About"
import { Selector } from "./Selector/Selector"
import { Tabs } from "./Tabs/Tabs"
import { BottomButtons } from "./Buttons"
import { RamenModal } from "./Modals/RamenModal"
import { useRef, useReducer } from "react"
import { ErrorBoundary } from "./ErrorBoundary"

const BASE_URL = 'https://ndlearning.8thwall.app/ar-math-viewer/'
/* *********************************
*   Int switch makes life simpler
*   * 0 = Function (xyz)
*   * 1 = Point (xyz)
*   * 2 = Vector <a,b,c>
*   * 3 = Vector Field
*   * 4 = Space Curve r(t)
********************************* */
const GraphKeys =   [
                        "Function (xyz)", 
                        "Point (xyz)", 
                        "Vector <a,b,c>", 
                        "Vector Field", 
                        "Space Curve r(t)"
                    ]

/* ****************************************
*   REDUCER DISPATCH FOR APP USEREDUCER
*   *   actionCall changes allow us to signal
    *   state changes in child components
**************************************** */
const reducer = (state, action) => {
    const temp = {...state}
    temp.action = action.type
    // this is just a helper
    const updateMod = () => {
        temp.label = action.label
        temp.content = action.content
        temp.vis = action.vis
        temp.modalCalls += 1
    }
    // main switches
    switch (action.type) {
        case 'MOD':
            updateMod()
            break
        case 'DEF':
            temp.component = action.component
            updateMod()
            temp.label = action.type
            break
        case 'VIS':
            console.log(`modal vis ${action.vis}`)
            temp.vis = action.vis
            break
        case 'ADD':
            temp.component = action.component
            temp.actionCalls += 1
            break
        case 'DEL':
            temp.actionCalls += 1
            break
        case 'QR':
            temp.actionCalls += 1
            break
        default:
            console.log('no action taken')
    }
    return {...temp}
}

export default function App({userframe})
{
    console.log(`APP: User is accessing from ${userframe}`)
    /* ****************************************
    INITIALIZING APP STATE
    **************************************** */
    const [state, dispatch] = useReducer(reducer, {
        component: 0,
        label: 'DEF',
        content: 'Placeholder',
        vis: false,
        action: null,
        actionCalls: 0,
        modalCalls: 0,
    })
    const url = useRef('/')

    const handleClose = () => dispatch({type: 'VIS', vis: false})
    const handleShow = () => dispatch({type: 'VIS', vis: true})

    const showURL = (act = false) => {
        if (act === true) {
            dispatch({
                type: 'MOD',
                label: null,
                content: `${url.current}`,
                vis: true
            })
        } else {
            dispatch({
                type: 'QR'
            })
        }
    }

    const seturl = (input, act = false) => {
        url.current = `${input}`
        if (act === true) {
            showURL(act)
        }
    }

    return(
        <div className="rm-app">
            <ErrorBoundary fallback={<p>Something went wrong</p>}>
            <RamenModal 
                parentState={state} 
                handleClose={handleClose}
                GraphKeys={GraphKeys}
            />
            <Header />
            <main id="content" className="rm-main">
                <About />
                <div className="rm-panel">
                    <p className="rm-panel-label">Graph components</p>
                    <Selector 
                        parentDispatch={dispatch}
                        userframe={userframe}
                        GraphKeys={GraphKeys}
                    />
                    <Tabs 
                        parentDispatch={dispatch}
                        userframe={userframe}
                        GraphKeys={GraphKeys}
                        parentState={state}
                        seturl={seturl}
                    />
                </div>
                <BottomButtons 
                    parentDispatch={dispatch}
                    showURL={showURL}
                />
            </main>
            <Footer />
            </ErrorBoundary>
        </div>
    )
}
