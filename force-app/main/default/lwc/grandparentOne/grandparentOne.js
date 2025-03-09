import { LightningElement, wire, track, api } from 'lwc';
import getAccountData from '@salesforce/apex/FamilyTreeController.getAccountData';
import updateAccountData from '@salesforce/apex/FamilyTreeController.updateAccountData';
import { refreshApex } from '@salesforce/apex';

export default class GrandparentOne extends LightningElement {
    @api recordId;
    @track parentOne = null;
    @track parentTwo = null;
    @track grandChildrenCount = 0;
    @track isMarried = false;
    @track showConnectButton = true;
    @track showMessage = false;
    wiredAccountData;

    message = 'Sorry, but you cannot have grandchildren at this time';

    @wire(getAccountData, { accountId: '$recordId' })
    wiredAccount(result) {
        this.wiredAccountData = result;
        if (result.data) {
            const { contacts, grandChildren, isMarried } = result.data;
            this.parentOne = contacts.length > 0 ? contacts[0] : null;
            this.parentTwo = contacts.length > 1 ? contacts[1] : null;
            this.grandChildrenCount = grandChildren;
            this.isMarried = isMarried;
            this.showConnectButton = !isMarried;
            this.showMessage = !(this.parentOne && this.parentTwo);
        } else if (result.error) {
            console.error(result.error);
        }
    }

    handleConnect() {
        updateAccountData({ accountId: this.recordId, isMarried: true })
            .then(() => refreshApex(this.wiredAccountData))
            .catch(error => console.error(error));
    }
    
}
