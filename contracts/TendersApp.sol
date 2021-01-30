// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract TendersApp {
    constructor() public {
        tenderCounter = 0;
        bidsCounter = 0;
    }

    enum ProposalStatus {unverified, verified, rejected}

    mapping(uint256 => tender) public tenders;
    mapping(uint256 => bid) public bids;

    uint256 public tenderCounter;
    uint256 public bidsCounter;
    modifier isTenderOwner(uint256 _tenderid) {
        for (uint256 i = 1; i <= tenderCounter; i++) {
            if (tenders[i].tenderId == _tenderid) {
                require(
                    tenders[i].tenderOwner == msg.sender,
                    "Only Tender Owner can close and choose the winners"
                );
            }
        }
        _;
    }
    struct tender {
        string tenderName;
        uint256 tenderId;
        string bidSubmissionClosingDate;
        string bidOpeningDate;
        string tasks;
        string constraints;
        uint256 finalTenderAmount;
        address tenderOwner;
    }

    struct bid {
        uint256 tenderId;
        uint256 bidId;
        address contractorAddress;
        string quotationClause;
        uint256 numberOfWorkingDays;
        uint256 proposalAmount;
        ProposalStatus status;
    }

    function createTender(
        string memory _tenderName,
        uint256 _tenderId,
        string memory _bidSubmissionClosingDate,
        string memory _bidOpeningDate,
        string memory _tasks,
        string memory _constraints,
        uint256 _finalTenderAmount
    ) public {
        tenderCounter++;
        tenders[tenderCounter] = tender(
            _tenderName,
            _tenderId,
            _bidSubmissionClosingDate,
            _bidOpeningDate,
            _tasks,
            _constraints,
            _finalTenderAmount,
            msg.sender
        );
    }

    function placeBid(
        uint256 _tenderId,
        uint256 _bidId,
        //address contractorAddress;
        string memory _quotationClause,
        uint256 _numberOfWorkingDays,
        uint256 _proposalAmount
    ) public {
        bidsCounter++;
        bids[bidsCounter] = bid(
            _tenderId,
            _bidId,
            msg.sender, //address contractorAddress;
            _quotationClause,
            _numberOfWorkingDays,
            _proposalAmount,
            ProposalStatus.unverified
        );
    }

    function completeTender(uint256 _tenderid, uint256 _bid)
        public
        isTenderOwner(_tenderid)
    {
        for (uint256 i = 1; i <= tenderCounter; i++) {
            if (tenders[i].tenderId == _tenderid) {
                for (uint256 j = 1;j <= bidsCounter; j++ ) {
                    if (bids[j].bidId == _bid) {
                        bids[j].status = ProposalStatus.verified;
                        tenders[i].finalTenderAmount = bids[i].proposalAmount;
                    } else {
                        bids[i].status = ProposalStatus.rejected;
                    }
                }
            }
        }
    }

    function getTenderBids(uint256 _tenderid)
        public view
        returns (
            uint256, //bidId;
            address, //contractorAddress;
            string memory, //quotationClause;
            uint256, //numberOfWorkingDays;
            uint256 //proposalAmount;
        )
    {
        for (uint256 i = 1; i <= tenderCounter; i++) {
            if (bids[i].tenderId == _tenderid) {
                return (
                    bids[i].bidId,
                    bids[i].contractorAddress,
                    bids[i].quotationClause,
                    bids[i].numberOfWorkingDays,
                    bids[i].proposalAmount
                );
            }
        }
    }
}
