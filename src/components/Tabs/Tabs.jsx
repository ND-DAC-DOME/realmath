import { useRef, useState, useEffect, useReducer } from 'react'
import { TabUIContainer } from './tabuihook'

/* useful constants */
const TAB_LIMIT = 7
const DELETION_ERROR_MSG = `You cannot delete all components-- empty graphs are considered invalid. Try adding another first!`
const LIMIT_ERROR_MSG = `There can only be a maximum of ${TAB_LIMIT} components! This is to prevent issues with rendering and latency.`
const INPUT_ERROR_MSG = `If you are seeing this message, there was a problem with your inputs! 
                         Input fields cannot be left empty. Function inputs must include at least one variable on at least one side of the equation.
                         Additionally, the assignment character '=' will cause your input to throw an error!`
const VIEW_ERROR_MSG = `You should not be able to see this message! If you can, please report it as a bug.`

/* shorten GraphKeys for display */
const GraphAlts =   [
						'Func',
						'Pt',
						'Vec',
						'VFld',
						'SCrv'
					]

const reducer = (state, action) => {
	const temp = {...state}
	/* selection helper */
	switch (action.type) {
		case 'NUM':
			temp.action = 'NUM'
			console.log(action)
			try {
				temp.numTabs = action.numTabs
			} catch (e) {
				console.error(`error in numTab change: ${e}`)
			}
			if (action.selected !== undefined) {
				temp.selected = [...action.selected]
			}
			break
		case "SEL":
			temp.action = 'SEL'
			if (action.newloc !== undefined) {
				temp.newSel = [...action.newloc]
				temp.actionCalls += 1
			} else {
				temp.selected = [...action.loc]
			}
			break
	}
	return {...temp}
}

export const Tabs = ({userframe, parentDispatch, parentState, seturl}) => 
{
    console.log(`DTABS`)

	/* ****************************************
	INITIALIZING TABS
	**************************************** */
	const tabs = useRef(new TabUIContainer(() => {state.parentDispatch({type: 'DEL'})}))
	const [state, dispatch] = useReducer(reducer, {
		parentDispatch: parentDispatch,
		numTabs: 1,
		selected: ['Func', 1],
		newSel: null,
		action: null,
		actionCalls: 0,
	})

	console.log(tabs.current)

	/* modal helper */
	const sendModal = (label, content) => {
		parentDispatch({
			type: 'MOD',
			label: label,
			content: content,
			vis: true,
		})
	}

	/* url helper */
	const sendURL = (act = false) => {
		const url = tabs.current.stringify_tabs()
		if(url !== -1) {
			seturl(`${url}`, act)
		} else if (act === true) {
			sendModal('INPUT ERROR', INPUT_ERROR_MSG)
		}
	}

	/* ****************************************
	LISTENING FOR ADDITION/DELETION
	**************************************** */
	useEffect(() => {
		switch (parentState.action) {
			case 'ADD':
				if (state.numTabs < TAB_LIMIT) {
					const tempnumTabs = tabs.current.add(GraphAlts[parentState.component], state.numTabs)
					if (tempnumTabs !== -1) {
						sendURL()
						dispatch({
							type: 'NUM',
							numTabs: tempnumTabs,
						})
					}
				} else {
					sendModal('COMPONENT LIMIT REACHED', LIMIT_ERROR_MSG)
				}
				break
			case 'DEL':
				if (state.numTabs > 1) {
					const newSelection = tabs.current.del(state.selected)
					sendURL()
					if (newSelection !== -1) {
						dispatch({
							type: 'NUM',
							numTabs: state.numTabs - 1,
							selected: newSelection.get_loc(),
						})
					}
				} else {
					sendModal('DELETION ERROR', DELETION_ERROR_MSG)
				}
				break
			case 'QR':
				sendURL(true)
				break
			default:
				console.log('no action triggered by parent')
		}
	}, [parentState.actionCalls])

	/* ****************************************
	LISTENING FOR CHANGE DISPATCH
	**************************************** */
	useEffect(() => {
		if (state.action === 'SEL') {
			try {
				const newSelection = tabs.current.get_selected(state.selected, state.newSel)
				if (newSelection !== -1) {
					dispatch({
						type: 'SEL',
						loc: newSelection.get_loc()
					})
				} else {
					throw new Error(`Error in Tabs.selectionAction`)
				}
			} catch (e) {
				console.error(`${e}`)
			}
		}
	}, [state.actionCalls])

	/* ****************************************
	ONCLICK CHANGE SELECTED TAB
	**************************************** */
	/* triggers the change event on button click */
	const selectionAction = (loc, e=null) => {
		e.preventDefault()
		e.target.blur()
		dispatch({
			type: 'SEL',
			newloc: loc
		})
	}

	/* ****************************************
	RENDERING
	**************************************** */
	const getCard = () => {
        console.log('getting card')
        try {
            return tabs.current.get_at(state.selected).display(userframe)
        } catch (e) {
            console.error(`error with displaying card: ${e}`)
            return `N/A`
        }
	}

	/* ****************************************
	REORDERING (drag and drop) AND RENAMING
	**************************************** */
	const [, rerender] = useReducer((n) => n + 1, 0)
	const [dragFrom, setDragFrom] = useState(null)
	const [dragOver, setDragOver] = useState(null)
	const [editing, setEditing] = useState(null)   // id of the tab being renamed
	const editDone = useRef(false)

	const endDrag = () => {
		setDragFrom(null)
		setDragOver(null)
	}

	const dropAt = (to) => {
		if (dragFrom !== null) {
			tabs.current.move(dragFrom, to)
			rerender()
		}
		endDrag()
	}

	const startEdit = (id) => {
		editDone.current = false
		setEditing(id)
	}

	const finishEdit = (loc, value, commit) => {
		if (editDone.current) {
			return
		}
		editDone.current = true
		setEditing(null)
		if (commit) {
			const error = tabs.current.rename(loc, value)
			if (error !== null) {
				sendModal('RENAME ERROR', error)
			} else {
				sendURL()
			}
		}
	}

	const get_tabs = () => {
		try {
			return tabs.current.get_tabs()
		} catch (e) {
			console.error(`Error in Tabs.get_tabs: ${e}`)
			return []
		}
	}

	const isSelected = (loc) => loc[0] === state.selected[0] && loc[1] === state.selected[1]

	const dropClass = (i) => {
		if (dragFrom === null || dragOver !== i || dragOver === dragFrom) {
			return ''
		}
		return dragOver < dragFrom ? ' is-drop-before' : ' is-drop-after'
	}

	return(
		<div className="rm-tabs-wrap">
			<ul className="rm-tabs" role="tablist" aria-label="Graph components">
				{get_tabs().map((tab, i) => {
					const active = isSelected(tab.loc)
					return (
						<li
							key={tab.id}
							role="presentation"
							className={`rm-tab-item${dragFrom === i ? ' is-dragging' : ''}${dropClass(i)}`}
							draggable={editing !== tab.id}
							onDragStart={(e) => {
								e.dataTransfer.effectAllowed = 'move'
								e.dataTransfer.setData('text/plain', tab.id)
								setDragFrom(i)
							}}
							onDragOver={(e) => {
								if (dragFrom === null) return
								e.preventDefault()
								e.dataTransfer.dropEffect = 'move'
								if (dragOver !== i) setDragOver(i)
							}}
							onDrop={(e) => {
								e.preventDefault()
								dropAt(i)
							}}
							onDragEnd={endDrag}
						>
							{editing === tab.id ? (
								<input
									type="text"
									className="rm-tab rm-tab-input is-active"
									aria-label={`Rename ${tab.name}`}
									defaultValue={tab.name}
									maxLength={30}
									size={Math.max(tab.name.length, 6)}
									autoFocus
									onFocus={(e) => e.target.select()}
									onKeyDown={(e) => {
										if (e.key === 'Enter') finishEdit(tab.loc, e.target.value, true)
										if (e.key === 'Escape') finishEdit(tab.loc, null, false)
									}}
									onBlur={(e) => finishEdit(tab.loc, e.target.value, true)}
								/>
							) : (
								<button
									type="button"
									className={`rm-tab${active ? ' is-active' : ''}`}
									role="tab"
									aria-selected={active}
									title={active ? 'Click to rename. Drag to reorder.' : 'Drag to reorder.'}
									onClick={(e) => {
										if (active) {
											e.preventDefault()
											startEdit(tab.id)
										} else {
											selectionAction(tab.loc, e)
										}
									}}
									onDoubleClick={() => startEdit(tab.id)}
								>
									{tab.name}
									{active && <span className="rm-tab-edit" aria-hidden="true">✎</span>}
								</button>
							)}
						</li>
					)
				})}
			</ul>
			<div className="rm-tab-panel" role="tabpanel">
				{getCard()}
			</div>
		</div>
	)
}