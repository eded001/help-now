import { departments, problems } from '../constants/main.constant.js';

export function translateDepartment(deptKey) {
    return departments[deptKey] || deptKey;
}

export function translateProblem(problemKey) {
    return problems[problemKey] || problemKey;
}