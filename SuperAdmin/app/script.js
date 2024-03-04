  function parseJwt(token) {
  try {
    
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded;
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
}
  let email;
  const authToken = localStorage.getItem('token');
  const decodedToken = parseJwt(authToken);
  const loggedInEmailId = decodedToken ? decodedToken.emailId : null;
  console.log('Logged-in User ID:', loggedInEmailId);  

  fetch('odata/v4/terminal/Terminal')
  .then(response => response.json())
  .then(data => {
    console.log(data.value);

    const selfIndex = data.value.findIndex(user => user.email === loggedInEmailId);
    console.log(selfIndex);
    const loggedInUser = data.value.find(user => user.email === loggedInEmailId);
    const loggedInUserRole=loggedInUser.role;
    console.log(loggedInUserRole);
    const memberList = document.getElementById('memberList');
    displaySelf(data.value[selfIndex]);

    const otherUsers = data.value.filter((user, index) => index !== selfIndex);
    console.log(otherUsers);

    
    otherUsers.forEach(user => {
        console.log(user);
      const userElement = createUserElement(user);
      userElement.style.float = 'right';

      
      if (loggedInUserRole === 'Leader') {
        
        if (user.role.toLowerCase() === 'Member') {
          const deleteButton = createButton('Delete', () => {
            email=user.email;
            deleteMember(user.email);
          });
          userElement.appendChild(deleteButton);
    
          const promoteButton = createButton('Promote to Co-Leader', () => {
            email=user.email;
            promoteToCoLeader(user.email);
          });
          userElement.appendChild(promoteButton);
        }
        else{
            const deleteButton = createButton('Delete', () => {
              email=user.email;  
              deleteMember(user.email);
              });
              userElement.appendChild(deleteButton);
        }
      }
      else if(loggedInUserRole==='co-leader'){
        if (user.role.toLowerCase() === 'Member') {
            const deleteButton = createButton('Delete', () => {
              email=user.email;
              deleteMember(user.email);
            });
            userElement.appendChild(deleteButton);
      
            const promoteButton = createButton('Promote to Co-Leader', () => {
              email=user.email;
              promoteToCoLeader(user.email);
            });
            userElement.appendChild(promoteButton);
          }
      }

      memberList.appendChild(userElement);
      const logout=createButton('Logout',()=>{
        localStorage.removeItem('token');
        window.location.href = './userlogin.html';
      })
      userElement.appendChild(logout);
    });
  })
  .catch(error => {
    console.error('Error fetching user data:', error);
    
  });

function displaySelf(selfUser) {
  const selfElement = createUserElement(selfUser);
  document.body.appendChild(selfElement);
}

// Function to create a user element
function createUserElement(user) {
  const userElement = document.createElement('div');
  userElement.innerHTML = `
    <ul>
      <li>Name: ${user.username}</li>
      <li>Email: ${user.email}</li>
      <li>Role: ${user.role}</li>
    </ul>
  `;
  return userElement;
}

function createButton(text, clickHandler) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', clickHandler);
  return button;
}

function deleteMember(email) {
 fetch(`/odata/v4/delete/Delete('${email}')`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
      .then(response => response.json())
      .then(data => {
        console.log('User deleted successfully:', data);
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  }
  function promoteToCoLeader(email) {
    fetch(`/odata/v4/promote/Promote('${email}')`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
     
      role: 'co-leader'
    })
  })
      .then(response => response.json())
      .then(data => {
       
        console.log('User promoted to Co-Leader successfully:', data);
        
      })
      .catch(error => {
        console.error('Error promoting user:', error);
        
      });
  }
  
