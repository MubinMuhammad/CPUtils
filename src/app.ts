/*
 * Before we start, I'm not a professional
 * programmer in TypeScript. Some of the code
 * may seem uselessly complicated. So, please
 * see this code with kindness in mind. And
 * if you want to fix anything, or improve the
 * code in general, It's greatly appreciated.
 *
 * Thanks.
 * */


/*
 * A simple implementation
 * of binary_search. here:
 *
 * arr - the array you are going to search on
 * x - the number you want to find
 * start - the start position in the array
 * end - the end position in the array
 * */
function binary_search (arr: number[], x: number, start: number, end: number) {
    if (start > end) return false;

    let mid = Math.floor((start + end) / 2);
    if (arr[mid] === x) return true;

    if (arr[mid] > x)
      return binary_search(arr, x, start, mid - 1);
    else
      return binary_search(arr, x, mid + 1, end);
}

async function show_user_interface(name: string) {
  try {
    /*
     * Trying to fetch data
     * about the user. might fail.
     * Don't know what todo if it fails.
     *
     * TODO:
     *  Set username and other infomation to null if fetch() fails.
     * */
    let user_info_response = await fetch("https://codeforces.com/api/user.info?handles=" + name)
    let user_data = await user_info_response.json()

    /*
     * Trying to remove any , . or ; if the name has it 
     * at the end of the username. Example,
     * Stevee, here, as the name Stevee, has a ',' at the end
     * of his username, we will remove it.
     * so that we can add ", Rating <his rating>" after his name.
     */
    const excluded_chars: string[] = [',', '.', ';']

    /*
     * Getting access to the profile.
     * */
    let profile_img: HTMLImageElement = document.getElementById('profile_img') as HTMLImageElement
    let profile_str: HTMLElement = document.getElementById('profile_str') as HTMLElement

    /*
     * Removing any , . or ; from the username's last character
     * */
    for (let i = 0; i < excluded_chars.length; i++) {
      if (user_data.result[0].handle[user_data.result[0].handle.length - 1] == excluded_chars[i]) {
        user_data.result[0].handle = user_data.result[0].handle.slice(0, -1)
      }
    }

    /*
     * Changing the username and the profile photo sothat
     * the effect can be seen in the frontend.
     * */
    profile_img.src = user_data.result[0].titlePhoto
    profile_str.textContent = user_data.result[0].handle + ", Rating: " + user_data.result[0].rating.toString()
  }
  catch {

  }
}

async function show_problem_interface(name: string) {
  /*
   * Getting access to the problem heading.
   * copying the current heading to a variable as the 
   * orginal heading will change.
   * */
  let problem_heading: HTMLElement = document.getElementById("problem_heading") as HTMLElement
  let problem_tmp_heading: string = problem_heading.textContent as string

  try {
    /*
     * here getting access to a unordered list. It's where problems are going
     * to be listed.
     *
     * TODO:
     *  Currently doesn't list the problems logically.
     *  The plan is to get the user's rating and add 200 to
     *  his current rating. And give the user problemset
     *  where the rating is ranging from 800-<user's rating + 200>
     * */
    let problem_list: HTMLElement = document.getElementById("problem_list") as HTMLElement

    /*
     * Showing the loading... text because the
     * It takes around 500ms to fetch the whole
     * problemset of codeforces. It's size is about
     * 80KB.
     * */
    problem_heading.textContent += " Loading..."

    let problem_info_response = await fetch("https://codeforces.com/api/problemset.problems?tags=implementation;constructive" + 
                                            "%20algorithms;%math;brute%20force;number%20theory;combinatorics;strings")
    let problem_data = await problem_info_response.json()

    /*
     * Here the we are fetching the user problemset status.
     * It's the problems he tried and solved. It includes
     * both Wrong_Answers and Accepteds.
     * */
    let user_problem_response = await fetch("https://codeforces.com/api/user.status?handle=" + name)
    let user_problem_data = await user_problem_response.json()
    
    /*
     * sorting the user's problemset status by it's ratings.
     * 
     * TODO:
     *  Don't know how to sort it by the problem.contestId.
     *  I think problem.contestId is more accurate than
     *  result.contestId.
     * */
    user_problem_data.result.sort((a: any, b: any) => {
      return a.contestId - b.contestId
    })
    
    /*
     * Here we are going to just take the problems that
     * the user actually solved. Because, we want to give
     * the user the problem they tried but failed to solve
     * in the problem list.
     * */
    let upd_validated_ids:number[] = []
    let tmp: number = -1
    
    /*
     * My way to filtering the accepted solutions.
     * It might not be the best. So, somebody wants to
     * improve the performance of this algorithm. I will
     * greatly appreciate it.
     * */
    for (let i: number = 0; i < user_problem_data.result.length; i++) {
      if (tmp === -1) {
        if (user_problem_data.result[i].verdict === "OK") {
          tmp = i
          upd_validated_ids.push(user_problem_data.result[i].contestId)
        }
      }
      else {
        if (user_problem_data.result[i].contestId !== user_problem_data.result[tmp].contestId
            && user_problem_data.result[i].verdict === "OK") {
          tmp = i;
          upd_validated_ids.push(user_problem_data.result[i].contestId)
        }
      }
    }

    /*
     * Listing the problems in the page.
     * It doesn't have any logic built
     * though.
     * */
    let problem_list_html: string = ""
    
    for (let i: number = 0; i < 10; i++) {
      let problem_url: string = "https://codeforces.com/problemset/problem/" +
        problem_data.result.problems[i].contestId.toString() + "/" + problem_data.result.problems[i].index.toString()
      
      problem_list_html += "<li> <a href=\"" + problem_url + "\"" + 
        "target=\"_blank\" class=\"text-sky-300 hover:underline\">" + 
        problem_data.result.problems[i].name + ", " + 
        problem_data.result.problems[i].rating.toString() + "</a> </li>"
    }

    problem_heading.textContent = problem_tmp_heading;
    problem_list.innerHTML = problem_list_html;
  }
  catch {
    /*
     * If somewhere the code fails to run
     * this will print Loading Failed in the
     * problem heading.
     * */
    problem_heading.textContent = problem_tmp_heading + " Loading Failed!"
  }
}

function main() {
  const name: string = "Mubin_Muhammad"

  show_user_interface(name)
  show_problem_interface(name)
}

main()
