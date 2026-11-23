import { TabTracker } from "./tabclasses";

const LABEL_MAX = 30

export class TabUIContainer {
    constructor (setDel) {
        this.Trackers = {
            Func: new TabTracker('Func', setDel, true),
            Pt: new TabTracker('Pt', setDel),
            Vec: new TabTracker('Vec', setDel),
            VFld: new TabTracker('VFld', setDel),
            SCrv: new TabTracker('SCrv', setDel),
        }
        /* tabs in display order: insertion order, changed only by move() */
        this.Order = [this.Trackers.Func.get_latest()]
    }

    add (type, numTabs) {
		try {
			this.Trackers[type].add(numTabs)
			this.Order.push(this.Trackers[type].get_latest())
			return (numTabs + 1)
		} catch (e) {
			console.error(`Error in TabsList.add(): ${e}`)
			return -1
		}
    }

    /* deletes the tab at loc and selects its neighbor (the next tab, or the previous one if it was last) */
    del (loc) {
		try {
			const prev = this.get_at(loc)
			const idx = this.Order.indexOf(prev)
			this.Order.splice(idx, 1)
			prev.deselect()
			prev.parent.del(prev.index)
			const curr = this.Order[Math.min(idx, this.Order.length - 1)]
			curr.select()
			return curr
		} catch (e) {
			console.error(`Error in TabUIContainer.del(): ${e}`)
			return -1
		}
    }

	get_at (loc) {
		return this.Trackers[loc[0]].get_at(loc[1])
	}

    get_selected (loc, newloc) {
		try {
			const prev = this.get_at(loc)
			const curr = this.get_at(newloc)
			prev.deselect()
			curr.select()
			return curr
		} catch (e) {
			console.error(`Error in TabUIContainer.get_selected(): ${e}`)
			return -1
		}
    }

	/* [{id, name, loc}] in display order; id is the stable internal name, name is what the user sees */
	get_tabs () {
		return this.Order.map((tab) => ({id: tab.name, name: tab.get_name(), loc: tab.get_loc()}))
	}

	/* moves the tab at display index `from` to display index `to` */
	move (from, to) {
		if (from === to || from < 0 || to < 0 || from >= this.Order.length || to >= this.Order.length) {
			return
		}
		const [tab] = this.Order.splice(from, 1)
		this.Order.splice(to, 0, tab)
	}

	/* renames the tab at loc; returns null on success or an error message. an empty name restores the default */
	rename (loc, label) {
		const tab = this.get_at(loc)
		const trimmed = `${label ?? ''}`.trim().replace(/\s+/g, ' ')
		if (trimmed.length === 0 || trimmed === tab.name) {
			tab.label = null
			return null
		}
		if (trimmed.length > LABEL_MAX) {
			return `Component names can be at most ${LABEL_MAX} characters long.`
		}
		const taken = this.Order.some((other) => other !== tab && other.get_name().toLowerCase() === trimmed.toLowerCase())
		if (taken) {
			return `Another component is already named "${trimmed}". Please choose a different name.`
		}
		tab.label = trimmed
		return null
	}

	stringify_tabs () {
		console.log('running stringify')
		const tempDict = {}
		try {
			for (const [key, value] of Object.entries(this.Trackers)) {
				console.log(key)
				const stringval = value.stringify()
				if (stringval === -1) {
					throw new Error(`invalid tab input, terminating stringify`)
				} else if (stringval !== 0) {
					console.log(JSON.stringify(stringval))
					tempDict[`${value.type}`] = (stringval)
				}
			}
		} catch (e) {
			console.error(`Error in TabUIContainer.stringify_tabs(): ${e}`)
			return -1
		}
		console.log(JSON.stringify(tempDict))
		return JSON.stringify(tempDict)
	}
}
