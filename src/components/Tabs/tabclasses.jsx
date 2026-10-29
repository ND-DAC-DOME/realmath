import { InputLayoutGetter } from '../Modular/Math/InputLayoutGetter'

// makes setting alias and input field faster
const InputCards    =   {
                            'Func'  :   {
                                'alias': 1, 
                                'props': {
                                    'left':'0', 
                                    'right':'0'
                                }
                            },
                            'Pt'    :   {
                                'alias': 2, 
                                'props': {
                                    'x': '0', 
                                    'y': '0', 
                                    'z': '0'
                                }
                            },
                            'Vec'   :   {
                                'alias': 3, 
                                'props': {
                                    'vec': {
                                        'x': '0', 
                                        'y': '0', 
                                        'z': '0'
                                    }, 
                                    'init': {
                                        'x': '0', 
                                        'y': '0', 
                                        'z': '0'
                                    }
                                }
                            },
                            'VFld'  :   {
                                'alias': 4, 
                                'props': {
                                    'x': '0', 
                                    'y': '0',
                                    'z': '0',
                                }
                            },
                            'SCrv'  :   {
                                'alias': 5, 
                                'props': {
                                    'x': '0', 
                                    'y': '0',
                                    'z': '0',
                                }
                            }
                        }

export class Tab
{
    constructor(parent, numtabs)
    {
        this.parent = parent
        this.index = parent.index
        this.type = InputCards[parent.type].alias
        this.name = `${parent.type} ${parent.index}`
        this.card = InputCards[parent.type].card
        this.props = {...InputCards[parent.type].props}
        this.selected = numtabs === 0 ? true : false
        this.value = null
        this.set_update()
    }
    // just makes life easier tbh
    select () {
        this.selected = true
    }
    deselect () {
        this.selected = false
    }
    get_loc () {
        return [this.parent.type, this.index]
    }
    // caches value, making it accessible even when another tab is shown
    set_update () {
        this.update = () => 
        {
            /* switch case is for object data saving */
            switch(this.type) 
            {
                case 1:     
                    // in case of function, have l/r props and if possible pull both sides of eq
                    try{
                        this.props.left = document.getElementById('leftMathField').getValue('latex')
                        this.props.right = document.getElementById('rightMathField').getValue('latex')
                        this.value = `${this.props.left}=${this.props.right}`
                        console.log(this.value)
                        console.log(this.props)
                    }catch(error){
                        console.error(error)
                    }
                    break;
                case 3:
                    // in case of vector, get vec + pt
                    try{
                        this.props.vec = {
                            x: `${document.getElementById('vxMathField').getValue('latex')}`,
                            y: `${document.getElementById('vyMathField').getValue('latex')}`,
                            z: `${document.getElementById('vzMathField').getValue('latex')}`,
                        }
                        this.props.init = {
                            x: `${document.getElementById('xMathField').getValue('latex')}`,
                            y: `${document.getElementById('yMathField').getValue('latex')}`,
                            z: `${document.getElementById('zMathField').getValue('latex')}`,
                        }
                        this.value = `<${this.props.vec.x}, ${this.props.vec.y}, ${this.props.vec.z}>`
                        console.log(this.value)
                        console.log(this.props)
                    }catch(error){
                        console.error(error)
                    }
                    break
                default:
                    // point, vfld, and scrv all have the same props
                    try {
                        this.props.x = document.getElementById('xMathField').getValue('latex')
                        this.props.y = document.getElementById('yMathField').getValue('latex')
                        this.props.z = document.getElementById('zMathField').getValue('latex')
                        this.value = `(${this.props.x}, ${this.props.y}, ${this.props.z})`
                        console.log(this.value)
                        console.log(this.props)
                    } catch (error) {
                        console.error(`error updating value for tab ${this.name}!: ${error}`)
                    }
            }
        }
    }
    // checks validity of inputs
    check_valid()
    {
        let inputval
        const checkNullEqual = (val) => {
            if (val.includes('null') || val.includes('=') || val.length === 0) {
                console.log("NULL FOUND")
                return true
            } else {
                return false
            }
        }
        switch (this.type) {
            case 1:     
                inputval = `${this.props.left}-${this.props.right}`
                console.log(inputval)
                // check if any null input or missing vars
                try {
                    if (checkNullEqual(inputval)) {
                        throw new Error(`null input found`)
                    } else {
                        // regex to detect variables
                        const regex = /[^a-z]*(?<var>[xyz])/g
                        if (inputval.search(regex) === -1) {
                            throw new Error(`no valid variables found`)
                        }
                    }
                } catch(e) {
                    console.error(`Error in case 1: ${e}`)
                    return false
                }
                break
            case 3:
                // in case of vector, get vec + pt
                try {
                    for (const prop in this.props.vec) {
                        inputval = `${this.props.vec[prop]}`
                        if (checkNullEqual(inputval)) {
                            return false
                        }
                    }
                    for (const prop in this.props.init) {
                        inputval = `${this.props.init[prop]}`
                        if (checkNullEqual(inputval)) {
                            return false
                        }
                    }
                } catch(error) {
                    console.error(error)
                }
                break
            default:
                // point, vfld, and scrv all have the same props
                try {
                    inputval = `(${this.props.x}, ${this.props.y}, ${this.props.z})`
                    try {
                        if (checkNullEqual(inputval)) {
                            return false
                        }
                    } catch(error) {
                        console.error(error)
                    }
                } catch (error) {
                    console.error(`error verifying value for tab ${this.name}!: ${error}`)
                }
        }
        return true
    }
    // passes any necessary input to display container before user sees it
    display (userframe) {
        console.log(`displaying card`)
        const button = () => {
            return(
                <div className="row mt-3 justify-content-end">
                    <div className="col-lg-2 col-12 mx-2">
                        <div className="d-grid"><button 
                            id="deleteComponent" 
                            type="button" 
                            className="btn btn-danger" 
                            onClick={() => {this.parent.setDel()}}
                        >
                            <span className="rm-btn-label">Remove</span>
                        </button></div>
                    </div>
                </div>
            )
        }
        return (
			<div className="card">
				<div className="card-body">
					<div className="row justify-content-center">
                        <InputLayoutGetter 
                            type={this.type} 
                            props={this.props} 
                            blank={false}
                            update={this.update}
                        />
                    </div>
					{button()}
				</div>
			</div>
        )
    }
}

/* ************************************ */
export class TabTracker
{
    constructor(type, setDel, defaultIn=false) {
        this.type = type
        this.current = {}
        this.index = 0
        this.setDel = setDel
        this.default = defaultIn
        if(defaultIn)
        {
            console.error(`default tracker detected`)
            this.add(0)
        }
    }

    get_at (index) {
        return this.current[index]
    }
	
    get_latest () {
        return this.current[this.index]
    }
	
    add (numtabs) {
		try {
			this.index += 1
			this.current[this.index] = new Tab(this, numtabs)
			return 1
		} catch (e) {
            console.error(`Error with ${this.type} TAB ADDITION: ${e}`)
			return -1
		}
    }
	
    del (index) {
        try {
            delete this.current[index]
			this.update()
			return 1
        } catch (e) {
            console.error(`Error with ${this.type} TAB DELETION: ${e}`)
			return -1
        }
    }
	
	stringify () {
		const tempDict = {}
        console.log(`stringify for ${this.type} tracker`)
        console.log(this.current)
        if (Object.keys(this.current).length < 1) {
            console.error(`No tabs in this tracker!`)
            return 0
        }
		try {
			for (const key in this.current) {
				if (this.current[key].check_valid() === true) {
					tempDict[this.current[key].name] = this.current[key].props
				} else {
				    throw new Error(`Tab at index ${key} in the ${this.type} tracker has invalid input.`)
                }
			}
		} catch (e) {
            console.error(`Error with ${this.type} TAB STRINGIFY: ${e}`)
            return -1
        }
		return tempDict
	}
}