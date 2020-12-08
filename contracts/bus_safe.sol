pragma solidity >=0.4.22 <0.8.0;

contract bus_safe {
    uint32 check_count;

    event AddCheck(
        address checker,
        string car_id,
        string check_res,
        string check_etc,
        uint64 check_time
    );

    struct check_list {
        address checker;
        string car_id;
        string check_res;
        string check_etc;
        uint64 check_time;
    }

    check_list[] public checks;

    function AddCheckList(string memory _car_id, string memory _check_res, string memory _check_etc,uint64 _check_time  ) public {
        address _checker = msg.sender;
        checks.push(check_list(_checker , _car_id,_check_res,_check_etc,_check_time));
        check_count ++;
        emit AddCheck(_checker , _car_id,_check_res,_check_etc,_check_time);
    }
    function TotalCount() public view returns(uint32) {
            return check_count;
        }

        
    function GetCheck(uint _index) public view returns(address ,string memory,string memory,string memory,uint64){
        return (checks[_index].checker, checks[_index].car_id,checks[_index].check_res, checks[_index].check_etc, checks[_index].check_time );
    }

    // function GetCheck(uint _index) public view returns(address){
    //     return checks[_index].checker;
    // }
        
}