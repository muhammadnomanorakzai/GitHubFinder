import { useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import { toast } from "react-hot-toast";
import apiClient from "../../lib/apiClient";

const fade = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");

  const handleChange = (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  };

  const sendMessage = async (event) => {
    event.preventDefault();

    if (status === "sending") {
      return;
    }

    setStatus("sending");

    try {
      await apiClient.post("/contact", form);
      setStatus("sent");
      setForm(initialForm);
      toast.success("Message sent successfully");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setStatus("error");
      toast.error(message);
    }
  };

  return (
    <section id="contact" className="page-section">
      <div className="section-shell">
        <div className="section-card overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <motion.div
              variants={fade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <span className="section-kicker">Contact</span>
              <h2 className="premium-title mt-5 text-4xl font-extrabold sm:text-5xl">
                Share feedback, ideas, or bugs
              </h2>
              <p className="section-subtitle mx-auto">
                Have a suggestion for GitHub Finder? Send a message and we will
                review it as soon as possible.
              </p>
            </motion.div>

            <motion.form
              onSubmit={sendMessage}
              variants={fade}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass-panel space-y-6 p-5 sm:p-7"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <Input
                  placeholder="Your Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Your Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <Input
                placeholder="Subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
              />
              <Textarea
                placeholder="Message, suggestion, or issue details..."
                name="message"
                rows={6}
                value={form.message}
                onChange={handleChange}
              />

              <div className="flex flex-col items-center pt-2">
                <button type="submit" disabled={status === "sending"} className="btn-primary">
                  {status === "sending" ? "Sending..." : "Send Message"}
                  <FaPaperPlane className="text-xs" />
                </button>

                {status === "sent" && (
                  <p className="mt-4 text-sm text-emerald-300">
                    Thanks, your message has been submitted successfully.
                  </p>
                )}
                {status === "error" && (
                  <p className="mt-4 text-sm text-rose-300">
                    Something went wrong. Please try again.
                  </p>
                )}
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Input({ placeholder, type = "text", ...rest }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="input-premium"
      required
      {...rest}
    />
  );
}

function Textarea({ placeholder, ...rest }) {
  return (
    <textarea
      placeholder={placeholder}
      className="input-premium resize-none"
      required
      {...rest}
    />
  );
}
