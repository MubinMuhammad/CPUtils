async function show_user_interface(name: string) {
  try {
    let user_info_response = await fetch("https://codeforces.com/api/user.info?handles=" + name)
    let user_data = await user_info_response.json()

    const excluded_chars: string[] = [',', '.', ';']

    let profile_img: HTMLImageElement = document.getElementById('profile_img') as HTMLImageElement
    let profile_str: HTMLElement = document.getElementById('profile_str') as HTMLElement

    for (let i: number = 0; i < excluded_chars.length; i++) {
      if (user_data.result[0].handle[user_data.result[0].handle.length - 1] == excluded_chars[i]) {
        user_data.result[0].handle = user_data.result[0].handle.slice(0, -1)
      }
    }

    profile_img.src = user_data.result[0].titlePhoto
    profile_str.textContent = user_data.result[0].handle + ", Rating: " + user_data.result[0].rating.toString()
  } catch {
  }
}

async function show_problem_interface(name: string) {
  let problem_heading: HTMLElement = document.getElementById("problem_heading") as HTMLElement
  let problem_tmp_heading: string | null = problem_heading.textContent;

  try {
    let problem_list: HTMLElement = document.getElementById("problem_list") as HTMLElement
    problem_heading.textContent += " Loading..."

    let problem_info_response = await fetch("https://codeforces.com/api/problemset.problems?tags=implementation;constructive" + 
                                            "%20algorithms;%math;brute%20force;number%20theory;combinatorics;strings")
    let user_problem_response = await fetch("https://codeforces.com/api/user.status?handle=" + name)
    let problem_data = await problem_info_response.json()
    let user_problem_data = await user_problem_response.json()
    
    user_problem_data.result.sort((a: any, b: any) => {
      return a.contestId - b.contestId
    })

    let problem_inner_html: string = ""
    
    
    for (let i: number = 0; i < 10; i++) {
      let problem_url: string = "https://codeforces.com/problemset/problem/" +
        problem_data.result.problems[i].contestId.toString() + "/" + problem_data.result.problems[i].index.toString()
      
      problem_inner_html += "<li> <a href=\"" + problem_url + "\"" + 
        "target=\"_blank\" class=\"text-sky-300 hover:underline\">" + 
        problem_data.result.problems[i].name + ", " + 
        problem_data.result.problems[i].rating.toString() + "</a> </li>"
    }

    problem_heading.textContent = problem_tmp_heading;
    problem_list.innerHTML = problem_inner_html;
  }
  catch {
    problem_heading.textContent = problem_tmp_heading + " Loading Failed!"
  }
}

function main() {
  const handle: string = "Mubin_Muhammad"

  show_user_interface(handle)
  show_problem_interface(handle)
}

main()
