import { common } from '../lib/common'
import {Cache} from "../lib/utils";

var workDemandApi = {
    workTypes (name) {
        return common.getRequest('/workDemand/workTypes', {name});
    },
};

export {
  workDemandApi
}
