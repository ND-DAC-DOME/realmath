import $ from 'jquery'

export const SelectorAdd = ({userframe, addSelection}) =>
{

    const triggerAddition = () => {
        console.log(`adding a ${document.getElementById('selector').value}`)
        addSelection(document.getElementById('selector').value)
    }

    return(
        <div className="d-grid">
            <button 
                type="button" 
                className="btn btn-primary" 
                id="selectorAdd" 
                onClick={triggerAddition}
            >
                <span className="rm-btn-label">Add component</span>
            </button>
        </div>
    )
}