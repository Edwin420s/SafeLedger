// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract AgreementVerification {
    mapping(bytes32 => uint256) private hashes;
    bytes32[] private hashList;

    event HashStored(bytes32 indexed hash, uint256 timestamp);

    function storeHash(bytes32 _hash) external {
        require(hashes[_hash] == 0, "Hash already exists");
        hashes[_hash] = block.timestamp;
        hashList.push(_hash);
        emit HashStored(_hash, block.timestamp);
    }

    function verifyHash(bytes32 _hash) external view returns (bool, uint256) {
        uint256 timestamp = hashes[_hash];
        return (timestamp != 0, timestamp);
    }

    function getHashCount() external view returns (uint256) {
        return hashList.length;
    }
}