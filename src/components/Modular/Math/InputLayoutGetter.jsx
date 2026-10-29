import { InputLayout } from './InputLayout'

/* helpers to prevent redundant code rewriting */
const PropHelper = (id, valueIn, onInput) => {
    return  {
        idIn: id,
        valueIn: valueIn,
        onInput: onInput
    }
}
const ColHelper = (className, isLabel, props) => {
    return {
        className: className,
        isLabel: isLabel,
        props: props
    }
}

/* having them in different files was icky sorry */
const Function = (props, UpdateHook) => {
    return  [
                [
                    ColHelper("col-12 col-md-5", false, PropHelper('leftMathField', props.left, UpdateHook)),
                    ColHelper("col-12 col-md-2 rm-eq-equals", true, '='),
                    ColHelper("col-12 col-md-5", false, PropHelper('rightMathField', props.right, UpdateHook))
                ]
            ]
}
const Point = (props, UpdateHook) => {
    return  [
                [
                    ColHelper("col-2", true, 'x'),
                    ColHelper("col-10 mb-1", false, PropHelper('xMathField', props.x, UpdateHook))
                ], 
                [
                    ColHelper("col-2", true, 'y'),
                    ColHelper("col-10 mb-1", false, PropHelper('yMathField', props.y, UpdateHook))
                ], 
                [
                    ColHelper("col-2", true, 'z'),
                    ColHelper("col-10", false, PropHelper('zMathField', props.z, UpdateHook))
                ]
            ]
}
const Vector = (props, UpdateHook) => {
    return  [
                [
                    ColHelper("col-12 text-start", true, 'Vector')
                ],
                [
                    ColHelper("col-2", true, 'x'),
                    ColHelper("col-10 mb-1", false, PropHelper('vxMathField', props.vec.x, UpdateHook))
                ], 
                [
                    ColHelper("col-2", true, 'y'),
                    ColHelper("col-10 mb-1", false, PropHelper('vyMathField', props.vec.y, UpdateHook))
                ], 
                [
                    ColHelper("col-2", true, 'z'),
                    ColHelper("col-10", false, PropHelper('vzMathField', props.vec.z, UpdateHook))
                ],
                [
                    ColHelper("col-12 text-start mt-1", true, 'Initial Position')
                ],
                [
                    ColHelper("col-2", true, 'x'),
                    ColHelper("col-10 mb-1", false, PropHelper('xMathField', props.init.x, UpdateHook))
                ], 
                [
                    ColHelper("col-2", true, 'y'),
                    ColHelper("col-10 mb-1", false, PropHelper('yMathField', props.init.y, UpdateHook))
                ], 
                [
                    ColHelper("col-2", true, 'z'),
                    ColHelper("col-10", false, PropHelper('zMathField', props.init.z, UpdateHook))
                ]
            ]
}
const VectorField = (props, UpdateHook) => {
    return  [
                [
                    ColHelper("col-2", true, 'M'),
                    ColHelper("col-10 mb-1", false, PropHelper('xMathField', props.x, UpdateHook))
                ], 
                [
                    ColHelper("col-2", true, 'N'),
                    ColHelper("col-10 mb-1", false, PropHelper('yMathField', props.y, UpdateHook))
                ], 
                [
                    ColHelper("col-2", true, 'P'),
                    ColHelper("col-10", false, PropHelper('zMathField', props.z, UpdateHook))
                ]
            ]
}
const SpaceCurve  = (props, UpdateHook) => {
    return  [
                [
                    ColHelper("col-2", true, 'x(t)'),
                    ColHelper("col-10 mb-1", false, PropHelper('xMathField', props.x, UpdateHook))
                ], 
                [
                    ColHelper("col-2", true, 'y(t)'),
                    ColHelper("col-10 mb-1", false, PropHelper('yMathField', props.y, UpdateHook))
                ], 
                [
                    ColHelper("col-2", true, 'z(t)'),
                    ColHelper("col-10", false, PropHelper('zMathField', props.z, UpdateHook))
                ]
            ]
}

/* the main getter */
export const InputLayoutGetter = ({type, props, blank, update}) => {
    console.log(`INPUT TYPE ${type}`)
    console.log(props)
    let rows = {}
    switch (type) {
        case 1:
            rows = Function(props, update)
            break
        case 2:
            rows = Point(props, update)
            break
        case 3:
            rows = Vector(props, update)
            break
        case 4:
            rows = VectorField(props, update)
            break
        case 5:
            rows = SpaceCurve(props, update)
            break
    }
    return InputLayout(rows, blank)
}