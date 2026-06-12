// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MoodLantern {
    mapping(address => uint256) public userCalms;
    mapping(address => uint256) public userFocuses;
    mapping(address => uint256) public userJoys;

    uint256 public totalCalms;
    uint256 public totalFocuses;
    uint256 public totalJoys;

    event CalmLit(address indexed user, uint256 userCalms, uint256 totalCalms);
    event FocusLit(address indexed user, uint256 userFocuses, uint256 totalFocuses);
    event JoyLit(address indexed user, uint256 userJoys, uint256 totalJoys);

    function lightCalm() external {
        unchecked {
            userCalms[msg.sender] += 1;
            totalCalms += 1;
        }
        emit CalmLit(msg.sender, userCalms[msg.sender], totalCalms);
    }

    function lightFocus() external {
        unchecked {
            userFocuses[msg.sender] += 1;
            totalFocuses += 1;
        }
        emit FocusLit(msg.sender, userFocuses[msg.sender], totalFocuses);
    }

    function lightJoy() external {
        unchecked {
            userJoys[msg.sender] += 1;
            totalJoys += 1;
        }
        emit JoyLit(msg.sender, userJoys[msg.sender], totalJoys);
    }
}
