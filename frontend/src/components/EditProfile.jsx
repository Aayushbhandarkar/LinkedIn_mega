import React, { useContext, useRef, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { userDataContext } from "../context/userContext";
import dp from "../assets/dp.webp";
import { FiPlus, FiCamera } from "react-icons/fi";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";

function EditProfile() {
  let { setEdit, userData, setUserData } = useContext(userDataContext);
  let { serverUrl } = useContext(authDataContext);

  let [firstName, setFirstName] = useState(userData.firstName || "");
  let [lastName, setLastName] = useState(userData.lastName || "");
  let [userName, setUserName] = useState(userData.userName || "");
  let [headline, setHeadline] = useState(userData.headline || "");
  let [location, setLocation] = useState(userData.location || "");
  let [gender, setGender] = useState(userData.gender || "");
  let [skills, setSkills] = useState(userData.skills || []);
  let [newSkills, setNewSkills] = useState("");
  let [education, setEducation] = useState(userData.education || []);
  let [newEducation, setNewEducation] = useState({ college: "", degree: "", fieldOfStudy: "" });
  let [experience, setExperience] = useState(userData.experience || []);
  let [newExperience, setNewExperience] = useState({ title: "", company: "", description: "" });

  let [frontendProfileImage, setFrontendProfileImage] = useState(userData.profileImage || dp);
  let [backendProfileImage, setBackendProfileImage] = useState(null);
  let [frontendCoverImage, setFrontendCoverImage] = useState(userData.coverImage || null);
  let [backendCoverImage, setBackendCoverImage] = useState(null);
  let [saving, setSaving] = useState(false);

  const profileImage = useRef();
  const coverImage = useRef();

  function addSkill(e) { 
    e.preventDefault(); 
    if (newSkills && !skills.includes(newSkills)) {
      setSkills([...skills, newSkills]); 
      setNewSkills("");
    }
  }
  
  function removeSkill(skill) { 
    setSkills(skills.filter((s) => s !== skill)); 
  }
  
  function addEducation(e) { 
    e.preventDefault(); 
    if (newEducation.college && newEducation.degree && newEducation.fieldOfStudy) {
      setEducation([...education, newEducation]); 
      setNewEducation({ college: "", degree: "", fieldOfStudy: "" });
    }
  }
  
  function removeEducation(edu) { 
    setEducation(education.filter((e) => e !== edu)); 
  }
  
  function addExperience(e) { 
    e.preventDefault(); 
    if (newExperience.title && newExperience.company && newExperience.description) {
      setExperience([...experience, newExperience]); 
      setNewExperience({ title: "", company: "", description: "" });
    }
  }
  
  function removeExperience(exp) { 
    setExperience(experience.filter((e) => e !== exp)); 
  }

  function handleProfileImage(e) { 
    let file = e.target.files[0]; 
    setBackendProfileImage(file); 
    setFrontendProfileImage(URL.createObjectURL(file)); 
  }
  
  function handleCoverImage(e) { 
    let file = e.target.files[0]; 
    setBackendCoverImage(file); 
    setFrontendCoverImage(URL.createObjectURL(file)); 
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      let formdata = new FormData();
      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("userName", userName);
      formdata.append("headline", headline);
      formdata.append("location", location);
      formdata.append("skills", JSON.stringify(skills));
      formdata.append("education", JSON.stringify(education));
      formdata.append("experience", JSON.stringify(experience));
      if (backendProfileImage) formdata.append("profileImage", backendProfileImage);
      if (backendCoverImage) formdata.append("coverImage", backendCoverImage);

      let result = await axios.put(serverUrl + "/api/user/updateprofile", formdata, { withCredentials: true });
      setUserData(result.data);
      setSaving(false);
      setEdit(false);
    } catch (error) {
      console.log(error);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <input type="file" accept="image/*" hidden ref={profileImage} onChange={handleProfileImage} />
      <input type="file" accept="image/*" hidden ref={coverImage} onChange={handleCoverImage} />

      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setEdit(false)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
          <button 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => setEdit(false)}
          >
            <RxCross1 className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Cover Photo Section */}
          <div className="mb-16 relative">
            <div 
              className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden cursor-pointer group transition-all"
              onClick={() => coverImage.current.click()}
            >
              {frontendCoverImage ? (
                <img src={frontendCoverImage} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-50 to-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Add cover photo</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <div className="bg-white/90 p-2 rounded-full">
                  <FiCamera className="w-5 h-5 text-gray-700" />
                </div>
              </div>
            </div>

            {/* Profile Photo */}
            <div 
              className="absolute -bottom-12 left-6 w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg cursor-pointer group transition-transform hover:scale-105"
              onClick={() => profileImage.current.click()}
            >
              <img src={frontendProfileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <FiCamera className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Form Sections */}
          <div className="mt-16 space-y-6">
            {/* Basic Information */}
            <Section title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  label="First Name" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  placeholder="Enter your first name" 
                />
                <InputField 
                  label="Last Name" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  placeholder="Enter your last name" 
                />
              </div>
              
              <InputField 
                label="Username" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                placeholder="Choose a username" 
              />
              
              <InputField 
                label="Headline" 
                value={headline} 
                onChange={(e) => setHeadline(e.target.value)} 
                placeholder="e.g. Software Engineer at Company" 
              />
              
              <InputField 
                label="Location" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="Where are you located?" 
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                >
                  <option value="" className="text-gray-500">Select gender</option>
                  <option value="male" className="text-gray-900">Male</option>
                  <option value="female" className="text-gray-900">Female</option>
                  <option value="other" className="text-gray-900">Other</option>
                </select>
              </div>
            </Section>

            {/* Skills Section */}
            <Section title="Skills">
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#eef6ff] px-3 py-1.5 rounded-full text-sm text-[#0a66c2] font-medium">
                    {skill}
                    <button 
                      onClick={() => removeSkill(skill)}
                      className="text-[#0a66c2] hover:text-red-500 transition-colors"
                    >
                      <RxCross1 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              <form onSubmit={addSkill} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Add a skill" 
                  value={newSkills} 
                  onChange={(e) => setNewSkills(e.target.value)} 
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent outline-none transition-all text-gray-900 bg-white" 
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-white border border-[#0a66c2] text-[#0a66c2] rounded-lg font-medium hover:bg-[#eef6ff] transition-colors"
                >
                  Add
                </button>
              </form>
            </Section>

            {/* Education Section */}
            <Section title="Education">
              {education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg mb-3 group hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{edu.college}</h4>
                    <p className="text-sm text-gray-600">{edu.degree} in {edu.fieldOfStudy}</p>
                  </div>
                  <button 
                    onClick={() => removeEducation(edu)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <RxCross1 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <form onSubmit={addEducation} className="space-y-3 mt-4">
                <InputField 
                  label="School/University" 
                  value={newEducation.college} 
                  onChange={(e) => setNewEducation({...newEducation, college: e.target.value})} 
                  placeholder="Enter school name" 
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField 
                    label="Degree" 
                    value={newEducation.degree} 
                    onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})} 
                    placeholder="e.g. Bachelor's" 
                  />
                  
                  <InputField 
                    label="Field of Study" 
                    value={newEducation.fieldOfStudy} 
                    onChange={(e) => setNewEducation({...newEducation, fieldOfStudy: e.target.value})} 
                    placeholder="e.g. Computer Science" 
                  />
                </div>
                
                <button 
                  type="submit"
                  className="px-4 py-2 bg-white border border-[#0a66c2] text-[#0a66c2] rounded-lg font-medium hover:bg-[#eef6ff] transition-colors"
                >
                  Add Education
                </button>
              </form>
            </Section>

            {/* Experience Section */}
            <Section title="Experience">
              {experience.map((exp, i) => (
                <div key={i} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg mb-3 group hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{exp.title}</h4>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500 mt-1">{exp.description}</p>
                  </div>
                  <button 
                    onClick={() => removeExperience(exp)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <RxCross1 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <form onSubmit={addExperience} className="space-y-3 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField 
                    label="Title" 
                    value={newExperience.title} 
                    onChange={(e) => setNewExperience({...newExperience, title: e.target.value})} 
                    placeholder="e.g. Software Engineer" 
                  />
                  
                  <InputField 
                    label="Company" 
                    value={newExperience.company} 
                    onChange={(e) => setNewExperience({...newExperience, company: e.target.value})} 
                    placeholder="Company name" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea 
                    value={newExperience.description} 
                    onChange={(e) => setNewExperience({...newExperience, description: e.target.value})} 
                    placeholder="Describe your responsibilities and achievements"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent outline-none resize-none transition-all text-gray-900 bg-white"
                  />
                </div>
                
                <button 
                  type="submit"
                  className="px-4 py-2 bg-white border border-[#0a66c2] text-[#0a66c2] rounded-lg font-medium hover:bg-[#eef6ff] transition-colors"
                >
                  Add Experience
                </button>
              </form>
            </Section>
          </div>
        </div>

        {/* Footer with Save Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end">
          <button 
            className="px-6 py-2.5 bg-[#0a66c2] text-white font-medium rounded-full hover:bg-[#004182] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            onClick={handleSaveProfile}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Reusable Section Component
const Section = ({ title, children }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h3>
    {children}
  </div>
);

// Reusable Input Field Component
const InputField = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent outline-none transition-all text-gray-900 bg-white"
    />
  </div>
);

export default EditProfile;