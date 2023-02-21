//SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.8.7;

contract NameRegistry{
    uint public NAME_FEE = 10;

    struct NameProperties {
        address owner;
        uint expiresAt;
    }

    struct NameListItem {
        bytes32 name;
        uint expiresAt;
    }

    mapping (bytes32 => NameProperties) public registry;
    bytes32[] public names;

    modifier isValidBlocks (uint numBlocks, uint deposit) {
        // Validate the number of blocks being added and the deposit equivalent
        require(numBlocks > 0, "Number of blocks must be greater than 0");
        require(deposit >= numBlocks * NAME_FEE, "Insufficient funds" );
        _;
    }

    function register(bytes32 name, uint numBlocks) external payable isValidBlocks(numBlocks, msg.value){
        require(block.number >= registry[name].expiresAt, "Name already taken");
        
        //Push to array of names if name doesn't already exist.
        if(registry[name].expiresAt == 0){
            names.push(name);
        }

        uint expiresAt = block.number + numBlocks;
        registry[name] = NameProperties(msg.sender, expiresAt);
    }

    function renew(bytes32 name, uint numBlocks) external payable isValidBlocks(numBlocks, msg.value) {
        require(block.number < registry[name].expiresAt, "Name is not registered");
        require(msg.sender == registry[name].owner, "Only the name owner can renew it");
        
        uint expiresAt = registry[name].expiresAt + numBlocks;
        registry[name] = NameProperties(msg.sender, expiresAt);        
    }

    function cancel(bytes32 name) public{
        require(block.number < registry[name].expiresAt, "Name is not registered");
        require(msg.sender == registry[name].owner, "Only the name owner can cancel it");

        uint refundBlocks = registry[name].expiresAt - block.number;
        uint totalRefund = refundBlocks * NAME_FEE;

        // To prevent multiple instances in name list during registration, expire name instead of delete
        registry[name].expiresAt = block.number;

        (bool sent, ) = msg.sender.call{value: totalRefund}("");
        require(sent, "Failed to complete refund");
    }
    
    function getRegisteredNames() public view returns (NameListItem[] memory) {
        NameListItem[] memory nameList = new NameListItem[](names.length);
        uint256 count = 0;

        for (uint256 i = 0; i < names.length; i++) {
            bytes32 name = names[i];
            if (registry[name].expiresAt > block.number && registry[name].owner == msg.sender) {
                nameList[count] = NameListItem(name, registry[name].expiresAt);
                count++;
            }
        }
        
        assembly {
            mstore(nameList, count)
        }

        return nameList;
    }
}