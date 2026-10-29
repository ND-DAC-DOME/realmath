import "https://esm.run/@cortex-js/compute-engine";

export const BottomButtons = ({parentDispatch, showURL}) =>
{
    /* call content trigger */
    const clickTrigger = () => {
        showURL()
    }

    // sets new content and calls reload when button clicked
    const getHelp = () =>
    {
        parentDispatch({
            type: 'MOD',
            label: 'HELP',
            content: null,
            vis: true,
        })
    }

    // reloads page
    const reload = () => {
        window.location.reload()
    }

    return (
        <div className="rm-actions">
            <button type="button" className="btn btn-primary" id="visualizeButton" onClick={clickTrigger}>
                <span className="rm-btn-label">Visualize it</span>
            </button>
            <button type="button" className="btn btn-secondary" id="helpButton" onClick={getHelp}>
                <span className="rm-btn-label">Help</span>
            </button>
            <button type="button" className="btn btn-danger-subtle" id="resetButton" onClick={reload}>
                <span className="rm-btn-label">Reset</span>
            </button>
            <a className="rm-link-btn" id="reportButton" href="mailto:arodri37@nd.edu">
                Report a bug
            </a>
        </div>
    )
}
