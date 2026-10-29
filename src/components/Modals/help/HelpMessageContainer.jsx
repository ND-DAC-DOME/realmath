import { HelpMessageGetter } from './HelpMessageGetter'

const tabs =    [
                    ['func', 0, 'Function'],
                    ['pt', 1, 'Point'],
                    ['vec', 2, 'Vector'],
                    ['vfld', 3, 'Vector Field'],
                    ['scrv', 4, 'Space Curve']
                ]

export const HelpMessage = () => {
    return (
    <>
        <div class="modal-body">
            <div class="tab-content" id="pills-tabContent">
                <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex="0">
                    <div className="justify-content-start">
                        <p>
                            Realmath is a tool allowing you to visualize up to 7 graphical components in Augmented Reality (AR)! 
                            It utilizes the <a class="link-opacity-100" href="https://mathlive.io/mathfield/">MathLive</a> library for its input fields, adjusted for the needs of the program. 
                            These input fields can take either LaTeX input or LaTeX shorthand (provided by the on-screen virtual math keyboard). LaTeX input which is copy-pasted into the input field will
                            automatically become shorthand matching the virtual keyboard symbols.
                        </p> <p>
                            There are forbidden symbols, such as '=', which will cause the input field to break. 
                            If any such symbols are found in your input, you will receive a popup notifying you, and your visualization will fail.
                        </p> <p>
                            To view specific information about each info type, navigate using the tabs included in this modal!
                        </p>
                    </div>
                </div>
                {tabs.map((tab) => (
                    <div 
                        class="tab-pane fade" 
                        id={`pills-${tab[0]}`} 
                        role="tabpanel" 
                        aria-labelledby={`pills-${tab[0]}-tab`} 
                        tabIndex={`${tab[1]+1}`}
                    >
                        <HelpMessageGetter type={tab[1]} />
                    </div>
                ))}
            </div>
        </div>
        <div class="modal-footer">
            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                        FAQ
                    </button>
                </li>
                {tabs.map((tab) => (
                    <li class="nav-item" role="presentation">
                        <button 
                            class="nav-link" 
                            id={`pills-${tab[0]}-tab`} 
                            data-bs-toggle="pill" 
                            data-bs-target={`#pills-${tab[0]}`} 
                            type="button" 
                            role="tab" 
                            aria-controls={`pills-${tab[0]}`} 
                            aria-selected="true"
                        >
                            {tab[2]}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    </>
    )
}