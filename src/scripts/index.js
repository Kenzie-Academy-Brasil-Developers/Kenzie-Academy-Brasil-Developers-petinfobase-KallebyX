export const baseUrl = "http://localhost:3333"
export const token = localStorage.getItem("@petInfo:token")
export const userName = localStorage.getItem("@petInfo:userName")

export async function getProfileUserName() {
  try {
    const token = localStorage.getItem("@petInfo:token");
    const response = await fetch(`${baseUrl}/users/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const profile = await response.json();

    if (response.ok) {
      const userName = profile.name;
      const userNameString = String(userName); 
      localStorage.setItem("@petInfo:userName", userNameString);
      return userNameString;
    } else {
      throw new Error("Falha ao obter o nome de usuário.");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Falha ao obter o nome de usuário.");
  }
}



export async function getProfileImage2() {
    try {
      const token = localStorage.getItem("@petInfo:token");
      const response = await fetch(`${baseUrl}/users/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const profile = await response.json();
  
      if (response.ok) {
        const imageUrl = profile.avatar;
        return imageUrl;
      } else {
        throw new Error("Falha ao obter a imagem de perfil.");
      }
    } catch (error) {
      console.log(error);
      throw new Error("Falha ao obter a imagem de perfil.");
    }
}