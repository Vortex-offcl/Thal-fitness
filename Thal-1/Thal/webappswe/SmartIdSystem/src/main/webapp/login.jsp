<h2>Login</h2>
<form action="login" method="post">
  Email: <input type="text" name="email"><br>
  Password: <input type="password" name="password"><br>
  <input type="submit" value="Login">
</form>

<% if (request.getParameter("error") != null) { %>
  <p style="color:red;">Invalid credentials!</p>
<% } %>
