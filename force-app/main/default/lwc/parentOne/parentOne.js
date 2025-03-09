import { LightningElement, api, track, wire } from 'lwc';
import getAccountData from '@salesforce/apex/FamilyTreeController.getAccountData';
import updateAccountData from '@salesforce/apex/FamilyTreeController.updateAccountData';
import { refreshApex } from '@salesforce/apex';

export default class ParentOne extends LightningElement {
    @api recordId;
    @api parent;
    @api isMarried;
    @track grandChildrenCount = 0;
    wiredAccountData;

    @wire(getAccountData, { accountId: '$recordId' }) 
    wiredAccount(result) {
        this.wiredAccountData = result;
        if (result.data) {
            this.grandChildrenCount = result.data.grandChildren;
        } else if (result.error) {
            console.error(result.error);
        }
    }

    handleAddGrandchild() {
        this.grandChildrenCount++;
        updateAccountData({ accountId: this.recordId, grandChildren: this.grandChildrenCount }) 
            .then(() => refreshApex(this.wiredAccountData))
            .catch(error => console.error(error));
    }
}
