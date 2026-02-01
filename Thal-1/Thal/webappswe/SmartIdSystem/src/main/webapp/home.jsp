<%@ page import="jakarta.servlet.http.*" %>
<%
  HttpSession session = request.getSession(false);
  if (session == null || session.getAttribute("name") == null) {
      response.sendRedirect("login.jsp");
      return;
  }
%>
<h2>Welcome, <%= session.getAttribute("name") %></h2>
<a href="index.html">Logout</a>
