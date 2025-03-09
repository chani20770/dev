import { LightningElement } from 'lwc';

export default class GrandChild extends LightningElement {
    handleAdd() {
        this.dispatchEvent(new CustomEvent('addgrandchild'));
    }
}
