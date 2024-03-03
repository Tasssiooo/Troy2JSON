#!/bin/ruby -w
require 'tk'
require 'json'

root = TkRoot.new
root.title = 'Troy converter'
root.withdraw

inname = Tk.getOpenFile(
  title: 'Open.troybin file', 
  filetypes: [
    ["troy files", "*.troy *.txt"],
    ["all files", "*.*"]
  ]
)

if File.file?(inname)
  defoutname = File.basename(inname)
  
  if defoutname.end_with?(".troy")
    defoutname.sub!('.troy', '.json')
  elsif defoutname.end_with?(".txt")
    defoutname.sub!('.txt', '.json')
  else
    defoutname += '.json'
  end

  outname = Tk.getSaveFile(
    title: 'Save .json file',
    initialfile: defoutname,
    filetypes: [['json files', '*.json']]
  )

  def convert_to_json(infile, outfile)
    emitters = infile.split(/[\n\r]\n/)
    blocks = emitters.map { |e| e.split(/\n/) }

    troy = {}

    blocks.each do |parts|
      emitter_name = parts[0].gsub(/[\[\]]/, "")
      troy[emitter_name] = {}

      parts.each do |part|
        property = part.match(/'?[a-z\-0-9]+(?=\=)/i)
        values = part.match(/-?(\d+(\.\d+)?(\s-?\d+(\.\d+)?)*)|[\w\-_\.\/]+(?=\")/i)

        if property
          property_name = property[0]
          values_in_array = values[0].split(" ").map { |v| v.match?(/\A-?\d+(\.\d+)?\z/) ? v.to_f : v}
          
          if values_in_array.length > 1
            troy[emitter_name][property_name] = values_in_array
          else 
            troy[emitter_name][property_name] = values_in_array[0]
          end
        end
      end
    end
  
    json = JSON.pretty_generate(troy)

    #Write to the file
    File.open(outfile, "w") { |f| f.write(json) }
  end

  infile = File.read(inname)
  File.open(outname, 'w:UTF-8') do |outfile|
    convert_to_json(infile, outfile)
  end
end

root.destroy