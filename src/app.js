"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function show_user_interface(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user_info_response = yield fetch("https://codeforces.com/api/user.info?handles=" + name);
            let user_data = yield user_info_response.json();
            const excluded_chars = [',', '.', ';'];
            let profile_img = document.getElementById('profile_img');
            let profile_str = document.getElementById('profile_str');
            for (let i = 0; i < excluded_chars.length; i++) {
                if (user_data.result[0].handle[user_data.result[0].handle.length - 1] == excluded_chars[i]) {
                    user_data.result[0].handle = user_data.result[0].handle.slice(0, -1);
                }
            }
            profile_img.src = user_data.result[0].titlePhoto;
            profile_str.textContent = user_data.result[0].handle + ", Rating: " + user_data.result[0].rating.toString();
        }
        catch (_a) {
        }
    });
}
function show_problem_interface(name) {
    return __awaiter(this, void 0, void 0, function* () {
        let problem_heading = document.getElementById("problem_heading");
        let problem_tmp_heading = problem_heading.textContent;
        try {
            let problem_list = document.getElementById("problem_list");
            problem_heading.textContent += " Loading...";
            let problem_info_response = yield fetch("https://codeforces.com/api/problemset.problems?tags=implementation;constructive" +
                "%20algorithms;%math;brute%20force;number%20theory;combinatorics;strings");
            let user_problem_response = yield fetch("https://codeforces.com/api/user.status?handle=" + name);
            let problem_data = yield problem_info_response.json();
            let user_problem_data = yield user_problem_response.json();
            user_problem_data.result.sort((a, b) => {
                return a.contestId - b.contestId;
            });
            let upd_validated_indices = [];
            let tmp = -1;
            for (let i = 0; i < user_problem_data.result.length; i++) {
                if (tmp === -1) {
                    if (user_problem_data.result[i].verdict === "OK") {
                        tmp = i;
                        upd_validated_indices.push(i);
                    }
                }
                else {
                    if (user_problem_data.result[i].contestId !== user_problem_data.result[tmp].contestId
                        && user_problem_data.result[i].verdict === "OK") {
                        tmp = i;
                        upd_validated_indices.push(i);
                    }
                }
            }
            console.log(upd_validated_indices);
            let problem_list_html = "";
            for (let i = 0; i < 10; i++) {
                let problem_url = "https://codeforces.com/problemset/problem/" +
                    problem_data.result.problems[i].contestId.toString() + "/" + problem_data.result.problems[i].index.toString();
                problem_list_html += "<li> <a href=\"" + problem_url + "\"" +
                    "target=\"_blank\" class=\"text-sky-300 hover:underline\">" +
                    problem_data.result.problems[i].name + ", " +
                    problem_data.result.problems[i].rating.toString() + "</a> </li>";
            }
            problem_heading.textContent = problem_tmp_heading;
            problem_list.innerHTML = problem_list_html;
        }
        catch (_a) {
            problem_heading.textContent = problem_tmp_heading + " Loading Failed!";
        }
    });
}
function main() {
    const name = "Mubin_Muhammad";
    show_user_interface(name);
    show_problem_interface(name);
}
main();
