import { w, Rect, Point, wrappers, S_Mouse, T_SvelteComponent } from './Global_Imports';
import type { Integer, Create_Mouse_State, Handle_Mouse_State } from './Types';

// Ancestry sometimes needs to access and or alter an associated svelte component

export default class Svelte_Wrapper {
	hid: Integer;
    _parentTypes: Array<T_SvelteComponent> = [];  // ABANDON
    handle_mouse_state: Handle_Mouse_State;
    type: T_SvelteComponent;
    element: HTMLElement;

    constructor(element: HTMLElement, handle_mouse_state: Handle_Mouse_State, hid: Integer, type: T_SvelteComponent, parentTypes: Array<T_SvelteComponent> = []) {
        this.hid = hid;
        this.type = type;
        this.element = element;
        this.set_parentTypes(parentTypes);  // ABANDON
        this.handle_mouse_state = handle_mouse_state;
    	wrappers.wrapper_add(this);
    }

    get boundingRect(): Rect {
        const rect = Rect.boundingRectFor(this.element);
        const unscale_factor = 1 / w.scale_factor;
        return rect?.multipliedBy(unscale_factor) ?? Rect.zero;
    }

    containsPoint(point: Point) { return this.boundingRect.contains(point); }

    handle_event(event: MouseEvent, create_mouse_state: Create_Mouse_State): boolean {
        const state = create_mouse_state(event, this.element);
        return this.handle_mouse_state(state);
    }

	//////////////////////////////////////
	//	 ABANDON remaining functions	//
	// WHY? negligible performance gain	//
	//////////////////////////////////////

    set_parentTypes(types: Array<T_SvelteComponent>) {
        this._parentTypes = types;
	}

    isHit(event: MouseEvent): boolean {
        const state = S_Mouse.hit(event);   // create a 'hit' mouse state
        return this.handle_mouse_state(state);
    }

    get parentTypes(): Array<T_SvelteComponent> {
        const types = this._parentTypes;
        if (!!types && types.length > 0) {
            return types;
        }
        return Svelte_Wrapper.parentTypes_for(this.type);
    }

    static parentTypes_for(type: string): Array<T_SvelteComponent> {
        switch (type) {
            case T_SvelteComponent.thumb:   return [T_SvelteComponent.paging];
            case T_SvelteComponent.widget:
            case T_SvelteComponent.app:     return [];
            case T_SvelteComponent.tools:
            case T_SvelteComponent.title:
            case T_SvelteComponent.rotate:  return [T_SvelteComponent.graph];
            case T_SvelteComponent.drag:
            case T_SvelteComponent.paging:
            case T_SvelteComponent.reveal:  return [T_SvelteComponent.rotate];
            case T_SvelteComponent.graph:
            case T_SvelteComponent.details:
            case T_SvelteComponent.banners: return [T_SvelteComponent.app];
        }
        return [T_SvelteComponent.banners];
    }

}
