// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title AgreementVerification
 * @dev Store and verify SHA-256 hashes of agreements on Hedera.
 *      This contract acts as an immutable proof registry.
 */
contract AgreementVerification {
    mapping(bytes32 => uint256) private hashes; // hash => timestamp
    bytes32[] private hashList;

    event HashStored(bytes32 indexed hash, uint256 timestamp);

    /**
     * @dev Store a hash with current block timestamp.
     * @param _hash The SHA-256 hash of the agreement.
     */
    function storeHash(bytes32 _hash) external {
        require(hashes[_hash] == 0, "Hash already exists");
        hashes[_hash] = block.timestamp;
        hashList.push(_hash);
        emit HashStored(_hash, block.timestamp);
    }

    /**
     * @dev Verify if a hash exists and return its timestamp.
     * @param _hash The hash to verify.
     * @return exists (bool) and timestamp (uint256)
     */
    function verifyHash(bytes32 _hash) external view returns (bool, uint256) {
        uint256 timestamp = hashes[_hash];
        return (timestamp != 0, timestamp);
    }

    /**
     * @dev Get total number of stored hashes.
     */
    function getHashCount() external view returns (uint256) {
        return hashList.length;
    }
}