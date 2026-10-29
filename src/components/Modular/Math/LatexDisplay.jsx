import katex from 'katex'
import 'katex/dist/katex.min.css'

/* helper for math display outside mathlive input */
export const LatexDisplay = ({str, disp=false}) => {
    if (disp) {
        return (
            <div className="katex" dangerouslySetInnerHTML={{ __html:katex.renderToString(`${str}`, {throwOnError: false, output:'html', displayMode:true})}}/>
        )
    } else {
        console.log('disp false')
        console.log(katex.renderToString(`${str}`, {throwOnError: false, output:'html'}))
        return (
            <div class="katex d-inline-block" dangerouslySetInnerHTML={{ __html:katex.renderToString(`${str}`, {throwOnError: false, output:'html'})}}/>
        )
    }
}