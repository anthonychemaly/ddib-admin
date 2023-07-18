// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SelfSovereignIdentity is ERC721, ERC721Enumerable, Ownable {
    struct Identity {
        string firstName;
        string lastName;
        uint256 dateOfBirth;
        string fatherName;
        string motherName;
        string placeOfBirth;
        string gender;
        string socialStatus;
        string city;
    }

    mapping(uint256 => Identity) private identities;
    mapping(uint256 => address) private identityOwners;

    uint256 private tokenIdCounter;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        tokenIdCounter = 0;
    }

    function createIdentity(
        string memory _firstName,
        string memory _lastName,
        uint256 _dateOfBirth,
        string memory _fatherName,
        string memory _motherName,
        string memory _placeOfBirth,
        string memory _gender,
        string memory _socialStatus,
        string memory _city,
        address _assignTo
    ) public onlyOwner {
        require(totalSupply() < 1, "Address already has an identity");
        require(bytes(_firstName).length > 0, "First name cannot be empty");
        require(bytes(_lastName).length > 0, "Last name cannot be empty");
        require(_dateOfBirth > 0, "Invalid date of birth");
        require(_assignTo != address(0), "Invalid assignee address");

        Identity memory newIdentity = Identity(
            _firstName,
            _lastName,
            _dateOfBirth,
            _fatherName,
            _motherName,
            _placeOfBirth,
            _gender,
            _socialStatus,
            _city
        );
        identities[tokenIdCounter] = newIdentity;

        _safeMint(_assignTo, tokenIdCounter);
        identityOwners[tokenIdCounter] = _assignTo;

        tokenIdCounter++;
    }

    function updateIdentity(
        uint256 _tokenId,
        string memory _firstName,
        string memory _lastName,
        uint256 _dateOfBirth,
        string memory _fatherName,
        string memory _motherName,
        string memory _placeOfBirth,
        string memory _gender,
        string memory _socialStatus,
        string memory _city
    ) public onlyOwner {
        require(bytes(_firstName).length > 0, "First name cannot be empty");
        require(bytes(_lastName).length > 0, "Last name cannot be empty");
        require(_dateOfBirth > 0, "Invalid date of birth");
        require(_exists(_tokenId), "Identity does not exist");

        Identity storage existingIdentity = identities[_tokenId];
        existingIdentity.firstName = _firstName;
        existingIdentity.lastName = _lastName;
        existingIdentity.dateOfBirth = _dateOfBirth;
        existingIdentity.fatherName = _fatherName;
        existingIdentity.motherName = _motherName;
        existingIdentity.placeOfBirth = _placeOfBirth;
        existingIdentity.gender = _gender;
        existingIdentity.socialStatus = _socialStatus;
        existingIdentity.city = _city;
    }

    function getIdentity(
        uint256 _tokenId
    )
        public
        view
        onlyOwnerOf(_tokenId)
        returns (
            string memory,
            string memory,
            uint256,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        require(_exists(_tokenId), "Identity does not exist");

        Identity memory identity = identities[_tokenId];
        return (
            identity.firstName,
            identity.lastName,
            identity.dateOfBirth,
            identity.fatherName,
            identity.motherName,
            identity.placeOfBirth,
            identity.gender,
            identity.socialStatus,
            identity.city
        );
    }

    function getMyIdentity()
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        uint256 totalTokens = totalSupply();

        for (uint256 tokenId = 0; tokenId < totalTokens; tokenId++) {
            if (_exists(tokenId) && ownerOf(tokenId) == msg.sender) {
                return getIdentity(tokenId);
            }
        }

        // If no token is found for the caller, return empty values
        return ("", "", 0, "", "", "", "", "", "");
    }

    function isAdult(uint256 _tokenId) public view returns (bool) {
        require(_exists(_tokenId), "Identity does not exist");

        Identity memory identity = identities[_tokenId];
        uint256 age = calculateAge(identity.dateOfBirth);

        // Adjust the condition based on the legal adult age in your jurisdiction
        return age >= 18;
    }

    function calculateAge(uint256 _dateOfBirth) private view returns (uint256) {
        uint256 currentTime = block.timestamp;
        uint256 age = (currentTime - _dateOfBirth) / 31536000; // Approximate number of seconds in a year
        return age;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        require(from == address(0), "Token not transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    modifier onlyOwnerOf(uint256 _tokenId) {
        require(
            ownerOf(_tokenId) == msg.sender,
            "Not the owner of the identity"
        );
        _;
    }
}
