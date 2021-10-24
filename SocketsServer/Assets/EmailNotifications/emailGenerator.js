module.exports = ({
  title,
  message,
  buttonText,
  buttonPath,
  logoUrl,
  imageUrl,
  clientUrl = "www.spotjobsapp.com",
  footerText = "Copyright © 2018 SpotJobs - Atomx llc All rights reserved. Spotjobs is a registered trademark"
}) => ({
  subject: title,
  html: ` 
	<table border="0" style="width: 80%; margin: 0 auto 10px" cellspacing="0" cellpadding="0">
  <tbody>
  <tr>
    <td align="right" valign="top" width="80" style="padding-right: 10px">
      <img src="${logoUrl}" alt="spotJobs logo"
           style="width: 40px; -webkit-border-radius: 10px;-moz-border-radius: 10px;border-radius: 10px;">
    </td>
    <td>
      <span style="font-size: 24px; color: #2479CA; font-weight: normal">${title}</span>
    </td>
  </tr>
  </tbody>
</table>
<table border="0" style="width: 80%; margin: 0 auto 30px">
  <tr>
    <td>
      <span style="display: block; height: 1px; background-color: silver"></span>
    </td>
  </tr>
</table>
<table border="0" style="width: 80%;
                         margin-left: auto;
                         margin-right: auto;
                         margin-bottom: 30px;
                         margin-top: 20px;">
  <tbody>
  <tr align="center">
    <td>
      <img src="${imageUrl}" alt="avatar"
           style="width: 100px;height: 100px;
           -webkit-border-radius: 100%;
           -moz-border-radius: 100%;
           border-radius: 100%;">
    </td>
  </tr>
  <tr align="center">
    <td>
      <p style="text-align: center; font-size: 20px;">
        ${message}
      </p>
    </td>
  </tr>
  <tr align="center">
    <td height="70">
      <a href="${buttonPath}"
         style="font-size: 20px;
         color: white;
         background-color: #2479CA;
         text-decoration: none;
         -webkit-border-radius: 5px;
         -moz-border-radius: 5px;
         border-radius: 5px;
         padding-left: 30px;
         padding-right: 30px;
         padding-top: 15px;
         padding-bottom: 15px;">
        ${buttonText}
      </a>
    </td>
  </tr>
  </tbody>
</table>
<table bgcolor="silver" width="100%" border="0">
  <tr height="40" align="center" valign="bottom">
    <td>
      <a href="https://www.spotjobsapp.com" style="text-decoration: none; text-align: center;">
        ${clientUrl}
      </a>
    </td>
  </tr>
  <tr align="center" height="60">
    <td>
      <p>
        ${footerText}
      </p>
    </td>
  </tr>
</table>`
});
