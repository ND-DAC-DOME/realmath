export const SelectorDefine = ({userframe, defineSelection}) =>
{
    const defineSelectedComponent = () => {
        defineSelection(document.getElementById('selector').value)
    }

    return(
        <div className="d-grid">
            <button type="button" className="btn btn-secondary" onClick={defineSelectedComponent}>
                <span className="rm-btn-label">Definition</span>
            </button>
        </div>
    )
}