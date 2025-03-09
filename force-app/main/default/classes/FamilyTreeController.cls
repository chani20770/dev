public with sharing class FamilyTreeController {

    @AuraEnabled(cacheable=true)
    public static AccountWrapper getAccountData(Id accountId) {
        if (String.isBlank(accountId)) {
            throw new IllegalArgumentException('Account ID is missing from request');
        }

        Account acc = [
            SELECT Id, Grandchildren__c, IsMarried__c, 
                   Contact1__r.Id, Contact1__r.Name, 
                   Contact2__r.Id, Contact2__r.Name
            FROM Account 
            WHERE Id = :accountId
            LIMIT 1
        ];

        return new AccountWrapper(acc);
    }

    @AuraEnabled
    public static void updateAccountData(Id accountId, Boolean isMarried, Integer grandChildren) {
        if (String.isBlank(accountId)) {
            throw new IllegalArgumentException('Account ID is required');
        }

        Account acc = [SELECT Id, Grandchildren__c, IsMarried__c FROM Account WHERE Id = :accountId LIMIT 1];

        if (isMarried != null) acc.IsMarried__c = isMarried;
        if (grandChildren != null) acc.Grandchildren__c = grandChildren;

        update acc;
    }

    public class AccountWrapper {
        @AuraEnabled public List<Map<String, String>> contacts = new List<Map<String, String>>();
        @AuraEnabled public Integer grandChildren = 0;
        @AuraEnabled public Boolean isMarried = false;

        public AccountWrapper(Account acc) {
            if (acc != null) {
                if (acc.Contact1__r != null) {
                    Map<String, String> contact1 = new Map<String, String>();
                    contact1.put('Id', acc.Contact1__r.Id);
                    contact1.put('Name', acc.Contact1__r.Name);
                    this.contacts.add(contact1);
                }
                if (acc.Contact2__r != null) {
                    Map<String, String> contact2 = new Map<String, String>();
                    contact2.put('Id', acc.Contact2__r.Id);
                    contact2.put('Name', acc.Contact2__r.Name);
                    this.contacts.add(contact2);
                }
                this.grandChildren = acc.Grandchildren__c != null ? Integer.valueOf(acc.Grandchildren__c) : 0;
                this.isMarried = acc.IsMarried__c;
            }
        }
    }
}
