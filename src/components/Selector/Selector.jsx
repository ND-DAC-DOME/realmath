import { SelectorDropdown } from "./selectorDropdown"
import { SelectorAdd } from "./selectorAdd"
import { SelectorDefine } from "./selectorDefine"
import { useState, useEffect, useRef } from "react"

export const Selector = ({parentDispatch, userframe, GraphKeys}) =>
{
    console.log(`DSELECTOR`)

	const defineSelection = (selection = 0) => {
        console.log(`selection is ${selection}`)
		parentDispatch({
            type: 'DEF',
            component: selection,
            vis: true,
        })
	}
	
	const addSelection = (selection) => {
		parentDispatch({
            type: 'ADD',
            component: selection,
        })
	}
	
    return(
        <div className="rm-selector-row mb-3">
            <SelectorDropdown GraphKeys={GraphKeys}/>
            <SelectorDefine userframe={userframe} defineSelection={defineSelection}/>
            <SelectorAdd userframe={userframe} addSelection={addSelection}/>
        </div>
    )
}