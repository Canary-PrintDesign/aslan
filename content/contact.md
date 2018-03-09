---
title: Contact
slug: contact
description: something
BgImg: tout_bg17.jpg
blurb: Every project starts with a question or two, we get that. So give us a call & we can have a quick chat!
---

<main class="contact">
  <p class="openingLine">One of our qualified consultants would be happy to meet with you to help build that perfect space. Simply call or email Hannah today and arrange a time that is convenient for you.</p>
  <div class="formContainer">
    <div class="contactDetails">
      <a class="email" href="mailto:info@aslanventures.ca">
        <i class="fas fa-envelope"></i>
        <span>info@aslanventures.ca</span>
      </a>
      <a href="tel:250-954-5367">
        <i class="fas fa-phone"></i>
        <span>250-954-5367</span>
      </a>
    </div>
        <form id="ajax-contact contact" method="post"
            action="https://static-files.canaryprint.ca/aslanventures.com/mailer.php">
          <div class="other field">
            <label for="name field">Name</label>
            <input type="text" id="name" name="name" />
          </div>
          <div class="other field">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div class="other field">
            <label for="phone">Phone Number</label>
            <input type="phone" id="phone" name="phone" />
          </div>
          <div class="other field">
            <label for="message">Your Message</label>
            <textarea id="message" name="message" rows="8" required ></textarea>
          </div>
          <button type="submit" class="btn-primary">Send in for Message</button>
        </form>
        <div id="form-messages"></div>
  </div>
</main>
